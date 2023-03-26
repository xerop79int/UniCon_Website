# import requests

# url = "https://api.openreview.net/groups?id=active_venues"
# response = requests.get(url)

# def get_each_venue(venue):
#     venue_url = 'https://openreview.net/group?id=' + venue
#     venue_response = requests.get(venue_url)
#     if venue_response.status_code == 200:
#         print(venue_response.text)

# if response.status_code == 200:
#     try:
#         response = response.json()
#         venues = response["groups"][0]["members"]
#         for venue in venues:
#             get_each_venue(venue)
#     except KeyError:
#         print("Unexpected response format: missing 'members' key")
# else:
#     print(f"Request failed with status code {response.status_code}")

import requests
import json
from bs4 import BeautifulSoup


official_reviews_url = []
venue_title = ""
venue_description = ""

def get_venue_title_and_official_reviews(venue):
    title = ""
    subtitle = ""
    instructions = ""
    location = ""
    website = ""
    email = ""
    date = ""


    url = "https://api.openreview.net/groups?id=" + venue
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()

        # Todo 
        # 1. GET the venue with venue inside and explore them
        # 2. GET the data of the venue and store them in a dictionary

        if (str(data["groups"][0]["web"])).find("HEADER") != -1:
            data = data["groups"][0]['web'].split("HEADER")[1]
            data = data.split(";")[0]
            data = data.split("= ")[1]

            try:
                data_dict = json.loads(data)
            except:
                if data[-1] != '"':
                    data = data + '"}'
                else:
                    data = data + '}'
                data_dict = json.loads(data)

            try:
                title = data_dict['title']
                if data_dict['subtitle']:
                    subtitle = data_dict['subtitle']
                if data_dict['location']:
                    location = data_dict['location']
                if data_dict['website']:
                    website = data_dict['website']
                if data_dict['contact']:
                    email = data_dict['contact']
                if data_dict['date']:
                    date = data_dict['date']
                if data_dict['instructions'] and data_dict['instructions'] != "":

                    soup = BeautifulSoup(data, 'html.parser')
                    # find the var HEADER in the data variable. 
                    # official_reviews = soup.find_all('a')
                    venue_descriptions = soup.find_all('p')[1:]
                    for venue_desc in venue_descriptions:
                        instructions += venue_desc.text
            except:
                pass
                
            url = 'http://localhost:8000/venue'
            data = {
                'title': title,
                'subtitle': subtitle,
                'description': instructions,
                'location': location,
                'website': website,
                'email': email,
                'date': date
            }

            response = requests.post(url, data=data)

            print(response.status_code)

        # venue_title = data_dict['title']

        # soup = BeautifulSoup(data, 'html.parser')
        # # find the var HEADER in the data variable. 
        # official_reviews = soup.find_all('a')
        # venue_descriptions = soup.find_all('p')[1:]

        # for venue_desc in venue_descriptions:
        #     venue_description += venue_desc.text
        
    

        # for review in official_reviews:
        #     official_reviews_url.append(review['href'])

def get_research_papers(venue):

    url = "https://api.openreview.net/groups?id=" + venue
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()

        # Todo 
        # 1. GET the venue with venue inside and explore them
        # 2. GET the data of the venue and store them in a dictionary

        if (str(data["groups"][0]["web"])).find("HEADER") != -1:
            data = data["groups"][0]['web'].split("HEADER")[1]
            data = data.split(";")[0]
            data = data.split("= ")[1]

            try:
                data_dict = json.loads(data)
            except:
                if data[-1] != '"':
                    data = data + '"}'
                else:
                    data = data + '}'
                data_dict = json.loads(data)

            try:
                title = data_dict['title']
                title = title.replace(" ", "_")

            except:
                pass

    url = "https://api2.openreview.net/notes?content.venueid=" + venue
    response = requests.get(url)

    paper = {}
    if response.status_code == 200:
        data = response.json()
        data = data["notes"]
        for each in data:
            try:
                paper["id"] = each["id"]
                paper["title"] = each["content"]["title"]
                paper["authors"] = each["content"]["authors"]
                paper["abstract"] = each["content"]["abstract"]
                paper["authorids"] = each["content"]["authorids"]
                paper['pdf'] = each['content']['pdf']
                if each['content']['code']:
                    paper['code'] = each['content']['code']
            except:
                pass
            
            # backend_url = 'http://localhost:8000/venue'
            # data = {
            #     'venue': title,
            #     'title': paper["title"],
            #     'abstract': paper["abstract"],
            #     'pdf': paper['pdf'],
            #     'code': paper['code'],
            #     'authors': "",
            # }

            # response = requests.post(backend_url, data=data)

            # print(response.status_code)

if __name__ == "__main__":
    url = "https://api.openreview.net/groups?id=active_venues"
    response = requests.get(url)
    response = response.json()
    venues = response["groups"][0]["members"]
    for venue in venues:
        #get_venue_title_and_official_reviews(venue)
        get_research_papers(venue)

        





