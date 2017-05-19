from flask import Flask, render_template, request, redirect, url_for, session
import smtplib

app = Flask(__name__)


@app.route('/', methods=['POST', 'GET'])
def home():
        return render_template("/index.html")

@app.route('/about', methods=['POST', 'GET'])
def about():
        return render_template("/about.html")

@app.route('/contact', methods=['POST', 'GET'])
def contact():
        return render_template("/contact.html")

@app.route('/contactsend', methods=['POST', 'GET'])
def contactsend():
    fromEmail = 'kellis1286@gmail.com'
    toEmail  = 'kellis1286@gmail.com'

    # Credentials
    # The actual mail send
    server = smtplib.SMTP('email-smtp.us-west-2.amazonaws.com:587')
    server.starttls()
    server.login("AKIAJEL66EMZ6CZJ3RPQ","AjO096yhGyKvRIsqOxHauqx+N+L8qWgSp9LqJhsN80i3")
    header = 'To:' + toEmail + '\n' + 'From: ' + fromEmail + '\n' + 'Subject:WebsiteContact HIT! \n'
    # print header
    name = request.form.get('name')
    email = request.form.get('email')
    body = request.form.get('message')
    msg = header + '\n' + name + '\n' + email + '\n' + body +  '\n\n'
    server.sendmail(fromEmail, toEmail, msg, name, email)

    server.quit()

    return render_template("/sent.html")

    
@app.route('/portfolio', methods=['POST', 'GET'])
def portfolio():
        return render_template("/portfolio.html")

@app.route('/skills', methods=['POST', 'GET'])
def skills():
        return render_template("/skills.html")

@app.route('/blackjack', methods=['POST', 'GET'])
def blackjack():
    return render_template("/blackjack.html")

@app.route('/simpsons', methods=['POST', 'GET'])
def simpsons():
    return render_template("/simpsons.html")

if __name__ == '__main__':
    app.run(debug=True)
