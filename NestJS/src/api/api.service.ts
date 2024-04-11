import axios from "axios"
import * as fs from 'fs'
import { Injectable } from '@nestjs/common';

import { client_id, client_secret, redirect_uri, username } from './amo-client.json'
import { access_token } from './tokens.json'

let acc_token = access_token;
interface Lead {
  id: number,
  name: string,
  price: number,
  created_at: number,
  user: string,
  status_name: string,
  status_color: string,
  contacts: {
    contact_name: string,
    contact_phone: string,
    contact_email: string
  }[]
}

@Injectable()
export class ApiService {

  async findAll(query?: string | null): Promise<{}> {
    return await leads(query)
  }

  findOne(query: string) {
    console.log('query' + query)
    return `This action returns a #${query} api`;
  }


}


async function leads(quer: string) {
  let attempt = 0;

  try {
    return await getLeads();
  } catch (e) {
    console.log(e)
    return { message: 'Query error access' }
  }

  async function getLeads() {
    if (attempt > 5) return
    attempt += 1;
    try {
      const query = quer;
      let answer: Lead[] = [];

      const leads = await axios.get(
        `https://${username}.amocrm.ru/api/v4/leads`,
        {
          headers: {
            'Authorization': `Bearer ${acc_token}`
          },
          params: {
            query: query,
            with: 'contacts'
          }
        }
      );

      if (!leads.data) {
        return answer
      }

      for (let item of leads.data._embedded.leads) {
        let lead: Lead = {
          id: item.id,
          name: item.name,
          price: item.price,
          created_at: Number(item.created_at + '000'),
          user: "",
          status_name: "",
          status_color: "",
          contacts: [],
        };
        const user = await axios.get(
          `https://${username}.amocrm.ru/api/v4/users/${item.created_by}`,
          {
            headers: {
              'Authorization': `Bearer ${acc_token}`
            }
          }
        );
        lead.user = user.data.name;
        const pipelines = await axios.get(
          `https://${username}.amocrm.ru/api/v4/leads/pipelines`,
          {
            headers: {
              'Authorization': `Bearer ${acc_token}`
            }
          }
        );

        const status = pipelines.data._embedded.pipelines[0]._embedded.statuses.find((status: { id: any; }) => status.id == item.status_id);
        lead.status_name = status.name;
        lead.status_color = status.color;

        for (let contact of item._embedded.contacts) {
          const resContact = await axios.get(
            `https://${username}.amocrm.ru/api/v4/contacts/${contact.id}`,
            {
              headers: {
                'Authorization': `Bearer ${acc_token}`
              }
            }
          );
          lead.contacts.push(
            {
              contact_name: resContact.data.name,
              contact_phone: resContact.data.custom_fields_values.find((fild: { field_code: string; }) => fild.field_code == 'PHONE').values[0].value,
              contact_email: resContact.data.custom_fields_values.find((fild: { field_code: string; }) => fild.field_code == 'EMAIL').values[0].value
            })
        }

        answer.push(lead)
      }
      // console.log(answer);
      return answer
    } catch (e) {
      if (e.response) {
        if (e.response.status === 401) {
          await refrashTokens();
          return await getLeads();
        }
      }
      console.log(e)
      return { message: 'Query error' }
    }
  };
};

async function refrashTokens() {
  console.log('Ty refesh')
  let content: { access_token: string, refresh_token: string } = await JSON.parse(fs.readFileSync(__dirname + '/tokens.json', 'utf8'));

  let new_data = await axios.post(
    `https://${username}.amocrm.ru/oauth2/access_token`,
    {
      'client_id': client_id,
      'client_secret': client_secret,
      'grant_type': 'refresh_token',
      'refresh_token': content.refresh_token,
      'redirect_uri': redirect_uri
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );

  content = {
    access_token: new_data.data.access_token,
    refresh_token: new_data.data.refresh_token
  };

  fs.writeFileSync(__dirname + '/tokens.json', JSON.stringify(content, null, 2));

  let contentNew = await JSON.parse(fs.readFileSync(__dirname + '/tokens.json', 'utf8'));
  
  acc_token = contentNew.access_token;
  console.log('refreshed')

}