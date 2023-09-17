from flask import Flask, request
from flask_cors import CORS
from flask import Flask, jsonify
from flask import send_from_directory
# <--- Api kirjastoja. Python kirjastoja -->
import matplotlib.pyplot as plt 
import json
from decimal import Decimal
import matplotlib.pyplot as plt 
import json
from decimal import Decimal
import copy
import os


app = Flask(__name__)
CORS(app)  # This ensures that CORS headers are set for communication between the React and Flask apps
image_folder = "./Images"
BASE_IMAGE_URL = "http://0.0.0.0:8000/images"

@app.route('/')
def index():
    return "Hello, World!"

@app.route('/api/calculate', methods=['POST'])
def calculate():
    
    data = request.json
    loans = data.get('loans')
    monthly_payment = data.get('monthlyPayment')
    response = start(loans, monthly_payment)
    image_filename = "output_image.png"
    image_url = f"http://localhost:8000/images/{image_filename}"
    return jsonify({"imageUrl": image_url})

@app.route('/images/<filename>', methods=['GET'])
def serve_image(filename):
    try:
        return send_from_directory(image_folder, filename)
    except Exception as e:
        return jsonify({"error": "Image not found!"}), 404

final_loan_costs = {}
loans = {}
history = {}

def done(loans, i):
    for loan in loans:
        if loan['amount'] == 0:
            final_loan_costs[loan["owner"]] = loan["cost"]
            loans.remove(loan)
            #print(json.dumps(loan, cls=DecimalEncoder))

def minumum_payments(sum, loans, i):
     payment = int(sum)
     cost = 0
     for x in loans:   
        cost += int(x['minimum_payment'])
     #Tässä voisi ilmoittaa jos lainojen maksu ei onnistu
     if payment >= cost:
         #maksetaan kaikista lainoista minimisumma
         for x in loans:
            if x['amount'] < x['minimum_payment']:
                 payment -= x['amount']
                 x['amount'] = 0
                 done(loans, i)
            else:
                #jos lainaa on maksamatta vähemmän kuin minimimaksu maksetaan se kokonaan pois
                x['amount'] -= x['minimum_payment']
                payment -= x['minimum_payment']
     else:
         #Jos rahat ei riitä kaikkiin minimimaksuihin yritetään maksaa joitakin lainoja kokonaan pois jotta tämä tilanne ei toistuisi
         for x in loans:
            if payment >=  x['amount'] and x['amount'] != 0:
                 payment -= x['amount']
                 x['amount'] = 0
                 done(loans, i)
        #jos edellisen jälkeen maksetaan kaikki jotka pystytään niihin joita ei pystytä maksamaan lisätään sakko
         loans = sorted(loans, key=lambda x: x['minimum_payment'], reverse=False)
         for x in loans:
                if payment >= x['minimum_payment'] and x['amount'] != 0:
                        payment -= x['minimum_payment']
                        x['amount'] -= x['minimum_payment']
                else:
                    x['amount'] += x['fine']
                    x['cost'] += x['fine']

     done(loans, i)
     loans = sorted(loans, key=lambda x: x['interest'], reverse=True)
     #jos minimi maksujen jälkeen jäi rahaa käytetään ns. yritetään päästä lainoista eroon mahdollisimman nopeasti, lumivyörymetodi voisi olla toinen vaihtoehto
     if payment > 0:
        additional_payments(loans, payment, i)

def additional_payments(loans, payment, i):
    #Jos tänne päästään niin siitäkin voisi kertoa käyttäjälle
    for x in loans:
         if x['amount'] > payment:
            x['amount'] -= payment
            payment = 0
         else:
             temp = x['amount']
             x['amount'] = 0
             payment -= temp

         if payment == 0:
            break
    done(loans, i)

def add_intrest(loans):
    for x in loans:
        if x['interest'] != 0:
            interest = x['amount'] * ((x['interest']/12)/100)
            x['amount'] += interest
            x['cost'] += interest

def get_visuals(history, ax1, ax2):

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 5))  # 1 row, 2 columns

    # First plot: Loan Amount
    for loan_name, amounts in history.items():
        ax1.plot(amounts, label=loan_name)
    ax1.grid(True, which='both', linestyle='--', linewidth=0.5)
    ax1.set_xlabel('Kuukaudet')
    ax1.set_ylabel('Lainan määrä')
    ax1.legend()

    loan_names = list(final_loan_costs.keys())
    costs = list(final_loan_costs.values())
    ax2.bar(loan_names, costs)
    ax2.set_xlabel('Lainat')
    ax2.set_ylabel('Kustannukset')
    ax2.set_title('Lainojen kustannukset')

    # Save the image to the specified directory
    save_directory = "./Images"
    image_name = "output_image.png"  # or dynamically generate a name if you want
    image_path = os.path.join(save_directory, image_name)
    fig.savefig(image_path)
    return image_path

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(obj)  # or float(obj) if you want to convert to float instead of string
        return super(DecimalEncoder, self).default(obj)

def update_types(loans):
    for loan in loans:
        # Assuming owner remains a string, so we skip it
        loan['amount'] = int(loan['amount'])
        loan['interest'] = int(loan['interest'])
        loan['minimum_payment'] = int(loan['minimum_payment'])
        loan['cost'] = int(loan['cost'])
        loan['fine'] = int(loan['fine'])
    return loans

def start(loans, payment):
    final_loan_costs.clear()
    loans = sorted(loans, key=lambda x: x['interest'], reverse=True)
    loans = update_types(loans)

    temp = {loan["owner"]: [] for loan in loans}

    i = 0
    while len(loans) != 0:
        for loan in loans:
            temp[loan["owner"]].append(int(loan["amount"]))
            history = copy.deepcopy(temp)
        minumum_payments(payment, loans, i)
        add_intrest(loans)
        i += 1
        if i > 120:
            break
    print("-----------------------------------------")
    print("Lainojen maksuun kuluu:", i-1, "kuukautta")
    print("-----------------------------------------")
    return get_visuals(history, history, final_loan_costs)


if __name__ == '__main__':
    app.run(debug=True)
