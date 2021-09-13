# Komputer Store

Work your way to a brand new computer!

## Description

This application displays a dynamic webpage using "vanilla" JavaScript with HTML and CSS.
It includes a Bank where the user stores earned money, and can take up loan.
Also a Work section where the user can work, transfer money, and downpay current loan.
Lastly, there is a section where the user can browse through and buy available Laptops.

## The Bank

The Bank is where the user stores aquired funds, displayed under "Balance".
This can both be through the transfer of "Pay" funds and from loan granted by the bank.
The user cannot get a loan more than double of the bank balance (i.e., if the user have 500kr, no more than 1000kr can be loaned).
There is two further loan constraints: 1. The user cannot get more than one bank loan before buying a computer. 2. Once the user have a loan, it must be downpayed before getting another loan.

## Work

The Work section displays the user's "Pay", which is achieved through working.
It also have three buttons: Work, Bank, and Downpay loan (which is hidden when the user has no loan): - The work button grants the user 100kr every time it gets clicked. - The Bank button transfers the funds from the "Pay" account to the "Balance" account, which is located in the Bank. - If the user have taken a loan, 10% of the Pay will be deducted and used as downpayment on the loan,
before the remaining 90% gets transferred to the user's Balance. - If the current loan amount is less than 10% of the Pay getting transferred, the loan gets fully downpaid before
the remaining funds go to the user's Balance. - The Downpay button takes the current funds from the Pay account and uses it to downpay the current loan. - If the current loan amount is less than the funds in the Pay account, the rest will remain in Pay.

## Store

The Store section of the webpage consist of two sections: Laptop selection and Info section.

### Laptop section

The laptop section is purely to browse through the various available laptops, and display their specs below "Features".
This is fetched from a provided API.

### Info section

The info section displays image, name, description, and price of the laptop that is chosen in the Laptop section.
It also contains a "Buy Now" button that the user can click to buy the disred laptop: - The buy now button first validates whether the bank balance is sufficient to purchase the selected laptop.
If the user do not have enouch money in the Bank, a message is displayed telling that the user need to work more to afford that laptop. - When the user have sufficient funds to buy the chosen laptop, the amount is deducted from the Bank Balance,
and the user receives feedback that congratulates on the newly bought laptop.
