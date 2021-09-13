const elBankBalance = document.getElementById("bank-balance")
const elLoanBalance = document.getElementById("loan-balance");
const elPayBalance = document.getElementById("pay-balance");
const elSelectLaptop = document.getElementById("select-laptop");
const elLaptopFeat = document.getElementById("laptop-feat");
const elImage = document.getElementById("image");
const elLaptopName = document.getElementById("info-title");
const elLaptopDescription = document.getElementById("info-desc");
const elLaptopPrice = document.getElementById("info-price");

const baseUrl = 'https://noroff-komputer-store-api.herokuapp.com';
const placeholderImg = 'https://i.ytimg.com/vi/5Jp9kZNlb-Q/maxresdefault.jpg';
let listOfLaptops;

let balance = 0;
let pay = 0;
let loan = 0;
let price = 0;
let canAquireLoan = true;
let currentLaptop;

// Anonymous function calling itself on startup to fetch api and store it in a variable.
// Maps api elements with title and id to display in select, before calling the Features() function.
(async () => {
    try {
        const response = await fetch(`${baseUrl}/computers`);
        listOfLaptops = await response.json();

        listOfLaptops.map((laptop) => {
            const elOption = document.createElement("option");
            elOption.innerText = laptop.title;
            // set ID as value so we can avoid duplicates
            elOption.value = laptop.id;
            elSelectLaptop.appendChild(elOption);
        });

        // calling the Features() function 
        Features(elSelectLaptop.value);
    } catch (error) {
        console.error(error);
    }
})();

// The getLaptopImage function fetches the images from the api and checks if ok, replaces with placeholder if not.
// This is later called upon in the Features() function.
const getLaptopImage = async (imageUrl) => {
    try {
        const img = await fetch(`${baseUrl}/${imageUrl}`)
        !img.ok ? elImage.src = placeholderImg : elImage.src = `${img.url}`;
    } catch (error) {
        console.log(error);
    }
}

// The setLaptopInfo first clears the feature string to prevent overfilling the list upon change,
// before mapping to a list based on title, description, and price.
const setLaptopInfo = (laptop) => {
    elLaptopFeat.innerHTML = "";

    laptop.specs.map((feature) => {
        let elListItem = document.createElement('li');
        elListItem.innerText = feature;
        elLaptopFeat.appendChild(elListItem);
    })

    elLaptopName.innerText = laptop.title;
    elLaptopDescription.innerText = laptop.description;
    elLaptopPrice.innerText = laptop.price + " NOK";
}

// The Features() function filters the list of laptops by their id, before calling the getLaptopImage
// and setLaptopInfo to display the correct information.
const Features = async (optionId) => {
    let option;
    typeof optionId == 'string' ? option = optionId : option = optionId.target.value;

    // This gets the first element filter returns, but since laptop.id is used, duplicates should not happen
    // even with products with similar names.
    currentLaptop = listOfLaptops.filter(laptop => laptop.id == option)[0];
    await getLaptopImage(currentLaptop.image);
    setLaptopInfo(currentLaptop)
};

// The checkIfLoanIsZero() checks if the user currently has a loan to toggle the visibility of
// the Downpay button, as well as the outstanding loan.
const checkIfLoanIsZero = () => {
    const loanContainer = document.getElementById('loan-container');
    const downpayButton = document.getElementById('downpay-button');

    // hide downpay button and outstanding loan
    if (loan === 0) {
        loanContainer.classList.add('hide');
        downpayButton.classList.add('hide');
    } 
    // show downpay button and outstanding loan
    else {
        loanContainer.classList.remove('hide');
        downpayButton.classList.remove('hide');
    }
}

// The updateBalances() function handles all currency updates in the program.
// This is later called in various functions with corresponding arguments to update
// and reset values to meet the desired requirements.
const updateBalances = (balanceType, update, reset) => {
    switch (balanceType) {
        case "pay":
            reset ? pay = 0 : pay += update;
            elPayBalance.innerText = pay + " kr";
            break;
        case "balance":
            reset ? balance = 0 : balance += update;
            elBankBalance.innerText = balance + " kr";
            checkIfLoanIsZero();
            break;
        case "loan":
            reset ? loan = 0 : loan += update;
            elLoanBalance.innerText = loan + " kr";
            checkIfLoanIsZero();
            break;
    }
}

// Updating pay after working, increasing balance with 100
const handleWork = () => {
    updateBalances("pay", 100)
}

// The handleLoan function takes input from the user,
// and checks if the user is eligible for a loan (and the requested amount).
// Various feedback is displayed if the user is not eligible for the loan (based on a set of requirements).
// If the loan is granted, the user's balances is updated, and feedback is provided that the loan was granted.
const handleLoan = () => {
    // amount cannot be more than double of bank balance
    let input = document.getElementById('requested-loan').value;
    let loanInput;

    // eliminates the possibility for string input, negative numbers,
    // and the possibility to start loanInput with 0
    let isNum = input.match(/^[1-9][0-9]*$/) != null;

    if (!isNum) {
        alert("Please input valid amount")
        return;
    }

    // parse loanInput from user to an integer
    loanInput = parseInt(input);

    // cannot get more than one bank loan before downpaying the current one
    if (loan !== 0) {
        alert("You need to downpay your loan before you take another one.")
    }
    // cannot get more than one bank loan before buying a computer
    else if (!canAquireLoan) {
        alert("You need to buy a computer to take another loan!");
    }
    // cannot get a bank loan that is more than double of the current bank balance
    else if (balance * 2 < loanInput) {
        alert("You have to work a little more to loan such an amount.");
    }
    // update balances, set canAquireLoan to false, and let the user know that the loan was approved
    else {
        updateBalances("loan", loanInput);
        updateBalances("balance", loanInput);
        canAquireLoan = false;
        alert(`You just aquired a loan, and now own the bank ${loanInput}`);
    }

    // closing the loan dialog popup
    closeLoanDialog()
}

// The handleDownpay() function updates the balances of the user's balance and pay.
// This handles both cases where the loan is fully or partially downpayed, where the relevant balances gets updated / reset.
// If the loan gets fully downpaid, the checkIfLoanIsZero() function will automatically get triggered to hide the 'outstanding loan'
// balance and the 'Downpay loan' button.
const handleDownpay = () => {
    if (loan < pay) {
        updateBalances("pay", -loan)
        updateBalances("loan", 0, true);
    }
    else {
        updateBalances("loan", -pay);
        updateBalances("pay", 0, true);
    }
}

// The openLoanDialog handles the popup to enter a value for the loan request.
const openLoanDialog = () => {
    // prompt popup box that allows to enter an abount
    const overlay = document.getElementById('overlay');
    overlay.classList.remove('hide');
}

// The closeLoanDialog handles the removal of the popup of the loan request.
const closeLoanDialog = () => {
    const overlay = document.getElementById('overlay');
    overlay.classList.add('hide');
}

// Transfer from pay to bank balance. If the user has a loan, 10% will be deducted and used as downpay.
// If the loan is less than 10% if the funds, the rest will be transferred to the user's balance.
// Lastly, all balances will be updated / reset accordingly.
const handleBank = () => {
    let funds = pay;

    if (loan) {
        let fee = funds * 0.1;

        if (loan < fee) {
            funds -= loan;
            updateBalances("balance", funds);
            // reset loan
            updateBalances("loan", 0, true);
        }
        else {
            funds = funds - fee;
            updateBalances("balance", funds);
            updateBalances("loan", -fee);
        }
    }
    else {
        updateBalances("balance", funds);
    }

    // reset pay
    updateBalances("pay", 0, true)
}

// The handleBuy() function let's the user buy the selected laptop, which will then inform the user and congratulate
// before the laptop price is reducted from the user's balance.
// If the user cannot afford the chosen laptop, a message will be displayed telling the user to work some more before buying it.
const handleBuy = () => {
    if (balance < currentLaptop.price) {
        alert(`You can't affort ${currentLaptop.title} yet. No worries, at ${currentLaptop.price} it is a little pricey. Back to work!`)
    }
    else {
        updateBalances("balance", -currentLaptop.price);
        canAquireLoan = true;

        alert(`Congratulations, you are now the proud owner of ${currentLaptop.title}!`)
    }
}

// Event listener that handles when the user changes which laptop to display (and possibly buy).
elSelectLaptop.addEventListener("change", Features);