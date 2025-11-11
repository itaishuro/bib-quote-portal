// var/www/html/bib/wp-content/themes/bib/js/calculator.js
document.addEventListener('DOMContentLoaded', () => {
    const mainContentArea = document.getElementById('mainContentArea');
    const closeButton = document.querySelector('.close-button');

    let carsData = []; // To store the parsed JSON data
    // --- Chatbot State Management ---
    let currentFlow = '';
    let currentStepIndex = 0;
    let calculationData = {};
    // const logoBase64 = put the base64 code for the  image here
      
    // --- Define ALL Flow Control Functions FIRST ---

    function askVehicleRegistration() {
        currentStepIndex++;
        renderCurrentStep();
    }
    
    function askCarCategory() {
        currentStepIndex++;
        renderCurrentStep();
    }
    

    function askCarYear() {
        currentStepIndex++;
        renderCurrentStep();
    }

    function askCarMakeModel() {
        currentStepIndex++;
        renderCurrentStep();
    }

    function askProposedValue() {
        currentStepIndex++;
        renderCurrentStep();
    }

    function askHouseUse() {
        currentStepIndex++;
        renderCurrentStep();
    }

    function askProposedInsuredValue() {
        currentStepIndex++;
        renderCurrentStep();
    }

    function askHouseAndContentsPersonalDetails() {
        currentStepIndex++;
        renderCurrentStep();
    }

    function askHouseAndContentsDetails() {
        currentStepIndex++;
        renderCurrentStep();
    }

    function askHouseUseForHouseAndContents() {
        currentStepIndex++;
        renderCurrentStep();
    }

    function askProposedInsuredValueForHouseAndContents() {
        currentStepIndex++;
        renderCurrentStep();
    }

    function askReplacementCostForHouseAndContents() {
        currentStepIndex++;
        renderCurrentStep();
    }

    function askHouseUseForHomeAndContents() {
        currentStepIndex++;
        renderCurrentStep();
    }

    function displayHouseContentsInfoMessage() {
        currentStepIndex++;
        renderCurrentStep();
    }

    function askReplacementCostForHouseContents() {
        currentStepIndex++;
        renderCurrentStep();
    }


    function handleHomeSubCategorySelection() {
        switch (calculationData.homeSubCategory) {
            case 'Home':
                currentFlow = 'homeOnly';
                break;
            case 'Contents':
                currentFlow = 'contentsOnly';
                break;
            case 'Home + Contents':
                currentFlow = 'homeAndContents';
                break;
        }
        currentStepIndex = 0;
        renderCurrentStep();
    }
    
    function askHouseUseForHome() {
        currentStepIndex++;
        renderCurrentStep();
    }
    
    function askProposedValueForHome() {
        currentStepIndex++;
        renderCurrentStep();
    }
    
    function askContentsValueForContents() {
        currentStepIndex++;
        renderCurrentStep();
    }
    
    function askContentsValueForHomeAndContents() {
        currentStepIndex++;
        renderCurrentStep();
    }


        function computeInsuranceQuote(data, flowType) {
        let finalQuote = 0;
        let termQuote = 0;
        let termLabel = "BI-ANNUAL";
        let breakdown = {};

        if (flowType === 'carInsurance') {
            const premiumRate = 0.03;
            const stampDutyRate = 0.05;
            const annualMotorLevy = 10.8;

            const subTotal = data.proposedValue * premiumRate;
            const stampDuty = subTotal * stampDutyRate;

            finalQuote = subTotal + stampDuty + annualMotorLevy;
            termQuote = finalQuote / 3; // 4-month term
            termLabel = "TERM (4 Months)";

            breakdown = {
                premiumRate: (premiumRate * 100).toFixed(2), // %
                premiumAmount: subTotal,
                levyRate: null,
                levyAmount: annualMotorLevy,
                stampDuty: stampDuty,
                totalPremium: finalQuote
            };

        } else if (flowType === 'homeInsurance') {
            const premiumRate = 0.001;
            const stampDutyRate = 0.05;

            const subTotal = data.proposedInsuredValue * premiumRate;
            const stampDuty = subTotal * stampDutyRate;

            finalQuote = subTotal + stampDuty;
            termQuote = finalQuote / 2; // Bi-annual

            breakdown = {
                premiumRate: (premiumRate * 100).toFixed(2), // %
                premiumAmount: subTotal,
                levyRate: null,
                levyAmount: 0,
                stampDuty: stampDuty,
                totalPremium: finalQuote
            };
        }

        return { finalQuote, termQuote, termLabel, breakdown };
    }


    function calculateCarQuote() {

        const { finalQuote, termQuote, termLabel, breakdown } = computeInsuranceQuote(calculationData, 'carInsurance');
        
        calculationData.breakdown = breakdown;

        const quoteMessage = `Thank you, ${calculationData.firstName} ${calculationData.surname}! We've noted your contact details: Phone: ${calculationData.phoneNumber || 'N/A'}, Email: ${calculationData.email || 'N/A'}. For your ${calculationData.carCategory} ${calculationData.carMake} ${calculationData.carModel} from ${calculationData.carYear}, with a proposed value of $${calculationData.proposedValue.toLocaleString()}, here's your estimated Car Insurance quote:`;

        flows.carInsurance.push({
            type: 'quote',
            quoteText: quoteMessage,
            data: calculationData
        });

        calculationData.quoteType = 'Car Insurance';
        sendQuoteEmail(termQuote, finalQuote, termLabel);

        currentStepIndex++;
        renderCurrentStep();
    }

    function calculateHomeQuote() {
        let finalQuote = 0;
        let termQuote = 0;
        let termLabel = "BI-ANNUAL";
        let breakdown = {};
        let quoteMessage = '';
    
        const stampDutyRate = 0.05;
        
        if (calculationData.homeSubCategory === 'Home') {
            // Home Only: 0.1% of building value
            const premiumRate = 0.001;
            const subTotal = calculationData.proposedInsuredValue * premiumRate;
            const stampDuty = subTotal * stampDutyRate;
            finalQuote = subTotal + stampDuty;
            termQuote = finalQuote / 2;
    
            breakdown = {
                premiumRate: (premiumRate * 100).toFixed(2),
                premiumAmount: subTotal,
                stampDuty: stampDuty,
                totalPremium: finalQuote,
                termPremium: termQuote
            };
    
            // Message for home only
            quoteMessage = `Thank you, ${calculationData.firstName} ${calculationData.surname}! We've noted your contact details: Phone: ${calculationData.phoneNumber || 'N/A'}, Email: ${calculationData.email || 'N/A'}. For your Home insurance with usage "${calculationData.houseUse}" and building value of $${calculationData.proposedInsuredValue.toLocaleString()}, here's your estimated quote:`;
    
        } else if (calculationData.homeSubCategory === 'Contents') {
            // Contents Only: 1.2% of contents value
            const premiumRate = 0.012;
            const subTotal = calculationData.contentsValue * premiumRate;
            const stampDuty = subTotal * stampDutyRate;
            finalQuote = subTotal + stampDuty;
            termQuote = finalQuote / 2;
    
            breakdown = {
                premiumRate: (premiumRate * 100).toFixed(2),
                premiumAmount: subTotal,
                stampDuty: stampDuty,
                totalPremium: finalQuote,
                termPremium: termQuote
            };
    
            // For contents 
            quoteMessage = `Thank you, ${calculationData.firstName} ${calculationData.surname}! We've noted your contact details: Phone: ${calculationData.phoneNumber || 'N/A'}, Email: ${calculationData.email || 'N/A'}. For your Contents insurance with contents value of $${calculationData.contentsValue.toLocaleString()}, here's your estimated quote:`;
    
        } else if (calculationData.homeSubCategory === 'Home + Contents') {
            // Home + Contents: 0.1% (building) + 1.2% (contents)
            const homePremiumRate = 0.001;
            const contentsPremiumRate = 0.012;
            
            const homeSubTotal = calculationData.proposedInsuredValue * homePremiumRate;
            const contentsSubTotal = calculationData.contentsValue * contentsPremiumRate;
            const subTotal = homeSubTotal + contentsSubTotal;
            
            const stampDuty = subTotal * stampDutyRate;
            finalQuote = subTotal + stampDuty;
            termQuote = finalQuote / 2;
    
            breakdown = {
                homePremiumRate: (homePremiumRate * 100).toFixed(2),
                homePremiumAmount: homeSubTotal,
                contentsPremiumRate: (contentsPremiumRate * 100).toFixed(2),
                contentsPremiumAmount: contentsSubTotal,
                stampDuty: stampDuty,
                totalPremium: finalQuote,
                termPremium: termQuote
            };
    
            // For both
            quoteMessage = `Thank you, ${calculationData.firstName} ${calculationData.surname}! We've noted your contact details: Phone: ${calculationData.phoneNumber || 'N/A'}, Email: ${calculationData.email || 'N/A'}. For your Home + Contents insurance with usage "${calculationData.houseUse}", building value of $${calculationData.proposedInsuredValue.toLocaleString()}, and contents value of $${calculationData.contentsValue.toLocaleString()}, here's your estimated quote:`;
        }
    
        calculationData.breakdown = breakdown;
    
        // Push to current flow (homeOnly, contentsOnly, or homeAndContents)
        flows[currentFlow].push({
            type: 'quote',
            quoteText: quoteMessage,
            data: calculationData
        });
    
        calculationData.quoteType = 'Home Insurance - ' + calculationData.homeSubCategory;
        // sendQuoteEmail(termQuote, finalQuote, termLabel);

        currentStepIndex++;
        renderCurrentStep();
    }

    function calculateHouseAndContentsQuote() {
        const basePremium = 1000;
        const valueFactor = calculationData.proposedInsuredValue ? (calculationData.proposedInsuredValue * 0.0005) : 0;
        const replacementFactor = calculationData.replacementCost ? (calculationData.replacementCost * 0.001) : 0;
        const finalQuote = basePremium + valueFactor + replacementFactor;
        const termQuote = finalQuote / 2;
        const termLabel = "BI-ANNUAL";
    
        const quoteMessage = `Thank you, ${calculationData.firstName} ${calculationData.surname}! We've noted your contact details: Phone: ${calculationData.phoneNumber || 'N/A'}, Email: ${calculationData.email || 'N/A'}. For your house with usage "${calculationData.houseUse}", proposed insured value of $${calculationData.proposedInsuredValue.toLocaleString()}, and replacement cost of furniture/property $${calculationData.replacementCost.toLocaleString()}, here's your estimated House & Contents Insurance quote:`;
    
        flows.houseAndContentsInsurance.push({
            type: 'quote',
            quoteText: quoteMessage,
            data: calculationData
        });
    
        calculationData.quoteType = 'House and Contents Insurance';
        sendQuoteEmail(termQuote, finalQuote, termLabel);
    
        currentStepIndex++;
        renderCurrentStep();
    }

    function calculateHouseContentsQuote() {
        const basePremium = 250;
        const replacementFactor = calculationData.replacementCost ? (calculationData.replacementCost * 0.0015) : 0;
        const finalQuote = basePremium + replacementFactor;
        const termQuote = finalQuote / 2;
        const termLabel = "BI-ANNUAL";
    
        const quoteMessage = `Thank you, ${calculationData.firstName} ${calculationData.surname}! We've noted your contact details: Phone: ${calculationData.phoneNumber || 'N/A'}, Email: ${calculationData.email || 'N/A'}. For your contents with a replacement cost of $${calculationData.replacementCost.toLocaleString()}, here's your estimated House Contents Insurance quote:`;
    
        flows.houseContentsInsurance.push({
            type: 'quote',
            quoteText: quoteMessage,
            data: calculationData
        });
    
        calculationData.quoteType = 'House Contents Insurance';
        sendQuoteEmail(termQuote, finalQuote, termLabel);
    
        currentStepIndex++;
        renderCurrentStep();
    }


    function askHomeSubCategory() {
        currentStepIndex++;
        renderCurrentStep();
    }

    function askProposedValueForHomeAndContents() {
        currentStepIndex++;
        renderCurrentStep();
    }
    
    function askContentsValueIfNeeded() {
        // Check if we need to ask for contents value
        if (calculationData.homeSubCategory === 'Contents' || calculationData.homeSubCategory === 'Home + Contents') {
            currentStepIndex++;
            renderCurrentStep();
        } else {
            // Skip contents step for "Home Only"
            calculationData.contentsValue = 0;
            calculateHomeQuote();
        }
    }

    //arrays of step objects ---
    const flows = {
        initial: [
            {
                type: 'initial_options_with_toggle',
                botMessage: "Hi I'm Itai. Where would you like to start?",
                initialOptions: [
                    { text: 'Motor Insurance', icon: `${bib_data.themeUrl}/assets/images/electric-car.png`, dataOption: 'Car' },
                    { text: 'Home Insurance', icon: `${bib_data.themeUrl}/assets/images/home.png`, dataOption: 'Home Insurance' }
                ],
                hiddenOptions: [
                    { text: 'Travel Insurance', icon: `${bib_data.themeUrl}/assets/images/travel.svg`, dataOption: 'Travel Insurance' },
                    { text: 'Agriculture Insurance', icon: `${bib_data.themeUrl}/assets/images/agriculture.svg`, dataOption: 'Agriculture Insurance' },
                    { text: 'Other Insurance', icon: `${bib_data.themeUrl}/assets/images/other.png`, dataOption: 'Other Insurance' }
                ]
            }
        ],
        carInsurance: [
            {
                type: 'loading',
                duration: 1500
            },
            {
                type: 'input',
                botMessage: "Let's get you the perfect price to cover your car. Please provide your details:",
                inputs: [
                    {
                        type: 'row', // New type to indicate a row of inputs
                        rowInputs: [
                            { id: 'firstName', placeholder: 'First Name', type: 'text', key: 'firstName', required: true },
                            { id: 'surname', placeholder: 'Last Name', type: 'text', key: 'surname', required: true }
                        ]
                    },
                    {
                        type: 'row', // New type to indicate another row of inputs
                        rowInputs: [
                            { id: 'phoneNumber', placeholder: 'Phone Number', type: 'tel', key: 'phoneNumber', required: true },
                            { id: 'email', placeholder: 'Email Address', type: 'email', key: 'email', required: true }
                        ]
                    }
                ],
                nextAction: askVehicleRegistration 
            },

            {
                type: 'input',
                botMessage: "Now, let's get your vehicle details. What is your vehicle registration number?",
                inputs: [
                    {
                        type: 'text',
                        id: 'vehicleRegistration',
                        placeholder: 'e.g., ABC1234',
                        required: true,
                        key: 'vehicleRegistration'
                    }
                ],
                nextAction: askCarYear 
            },

            {
                type: 'input',
                botMessage: "Please tell me about the car you want to insure",
                inputs: [
                    {
                        id: 'yearOfManufacture',
                        placeholder: 'Year of manufacture',
                        type: 'select',
                        key: 'carYear',
                        options: generateYearOptions(30),
                        required: true
                    }
                ],
                nextAction: askCarCategory
            },
            {
                type: 'input',
                botMessage: "What type of car is it?",
                inputs: [
                    {
                        id: 'carCategory',
                        placeholder: 'Select Category',
                        type: 'select',
                        key: 'carCategory',
                        options: [
                            { value: 'Convertible', text: 'Convertible' },
                            { value: 'Coupe', text: 'Coupe' },
                            { value: 'Hatchback', text: 'Hatchback' },
                            { value: 'Minivan', text: 'Minivan' },
                            { value: 'Pickup', text: 'Pickup' },
                            { value: 'Sedan', text: 'Sedan' },
                            { value: 'SUV', text: 'SUV' },
                            { value: 'TRUCK', text: 'TRUCK' },
                            { value: 'Van', text: 'Van' },
                            { value: 'Wagon', text: 'Wagon' }
                        ],
                        required: true
                    }
                ],
                nextAction: askCarMakeModel
            },
            {
                type: 'input',
                botMessage: "What is the make and model of your car?",
                inputs: [
                    { id: 'carMake', placeholder: 'Select Make', type: 'select', key: 'carMake', options: [], required: true },
                    { id: 'carModel', placeholder: 'Input Car Model Here...', type: 'text', key: 'carModel', required: true }
                ],
                nextAction: askProposedValue
            },
            {
                type: 'input',
                botMessage: "What is your proposed value for the car?",
                inputs: [
                    { id: 'proposedValue', placeholder: 'Proposed Value ($)', type: 'number', key: 'proposedValue', required: true, min: 1000, step: 100 }
                ],
                nextAction: calculateCarQuote
            }
        ],
        homeInsurance: [
            {
                type: 'loading',
                duration: 1500
            },
            {
                type: 'input',
                botMessage: "What type of home insurance coverage do you need?",
                inputs: [
                    {
                        id: 'homeSubCategory',
                        placeholder: 'Select coverage type',
                        type: 'select',
                        key: 'homeSubCategory',
                        options: [
                            { value: 'Home', text: 'Home (Building Only)' },
                            { value: 'Contents', text: 'Contents Only' },
                            { value: 'Home + Contents', text: 'Home + Contents' }
                        ],
                        required: true
                    }
                ],
                nextAction: handleHomeSubCategorySelection
            }
        ],
        homeOnly: [
            {
                type: 'input',
                botMessage: "Let's get your details for Home Insurance. Please provide your information:",
                inputs: [
                    {
                        type: 'row',
                        rowInputs: [
                            { id: 'firstName', placeholder: 'First Name', type: 'text', key: 'firstName', required: true },
                            { id: 'surname', placeholder: 'Last Name', type: 'text', key: 'surname', required: true }
                        ]
                    },
                    {
                        type: 'row',
                        rowInputs: [
                            { id: 'phoneNumber', placeholder: 'Phone Number', type: 'tel', key: 'phoneNumber', required: true },
                            { id: 'email', placeholder: 'Email Address', type: 'email', key: 'email', required: true }
                        ]
                    }
                ],
                nextAction: askHouseUseForHome
            },
            {
                type: 'input',
                botMessage: "What is the primary use of the property?",
                inputs: [
                    {
                        id: 'houseUse',
                        placeholder: 'Select use of property',
                        type: 'select',
                        key: 'houseUse',
                        options: [
                            { value: 'I live there', text: 'I live there (Primary Residence)' },
                            { value: 'Business Premises', text: 'Business Premises' },
                            { value: 'I\'m Leasing It', text: 'I\'m Leasing It (Rental Property)' },
                            { value: 'Its a Guesthouse', text: 'It\'s a Guesthouse' }
                        ],
                        required: true
                    }
                ],
                nextAction: askProposedValueForHome
            },
            {
                type: 'input',
                botMessage: "What is your proposed insured value for the building?",
                inputs: [
                    { id: 'proposedInsuredValue', placeholder: 'Enter building value', type: 'number', key: 'proposedInsuredValue', required: true, min: 10000, step: 1000 }
                ],
                nextAction: calculateHomeQuote
            }
        ],
        contentsOnly: [
            {
                type: 'input',
                botMessage: "Let's get your details for Contents Insurance. Please provide your information:",
                inputs: [
                    {
                        type: 'row',
                        rowInputs: [
                            { id: 'firstName', placeholder: 'First Name', type: 'text', key: 'firstName', required: true },
                            { id: 'surname', placeholder: 'Last Name', type: 'text', key: 'surname', required: true }
                        ]
                    },
                    {
                        type: 'row',
                        rowInputs: [
                            { id: 'phoneNumber', placeholder: 'Phone Number', type: 'tel', key: 'phoneNumber', required: true },
                            { id: 'email', placeholder: 'Email Address', type: 'email', key: 'email', required: true }
                        ]
                    }
                ],
                nextAction: askContentsValueForContents
            },
            {
                type: 'input',
                botMessage: "What is the replacement cost of your contents/furniture?",
                inputs: [
                    { id: 'contentsValue', placeholder: 'Enter contents value', type: 'number', key: 'contentsValue', required: true, min: 1000, step: 100 }
                ],
                nextAction: calculateHomeQuote
            }
        ],        
        homeAndContents: [
            {
                type: 'input',
                botMessage: "Let's get your details for Home + Contents Insurance. Please provide your information:",
                inputs: [
                    {
                        type: 'row',
                        rowInputs: [
                            { id: 'firstName', placeholder: 'First Name', type: 'text', key: 'firstName', required: true },
                            { id: 'surname', placeholder: 'Last Name', type: 'text', key: 'surname', required: true }
                        ]
                    },
                    {
                        type: 'row',
                        rowInputs: [
                            { id: 'phoneNumber', placeholder: 'Phone Number', type: 'tel', key: 'phoneNumber', required: true },
                            { id: 'email', placeholder: 'Email Address', type: 'email', key: 'email', required: true }
                        ]
                    }
                ],
                nextAction: askHouseUseForHomeAndContents
            },
            {
                type: 'input',
                botMessage: "What is the primary use of the property?",
                inputs: [
                    {
                        id: 'houseUse',
                        placeholder: 'Select use of property',
                        type: 'select',
                        key: 'houseUse',
                        options: [
                            { value: 'I live there', text: 'I live there (Primary Residence)' },
                            { value: 'Business Premises', text: 'Business Premises' },
                            { value: 'I\'m Leasing It', text: 'I\'m Leasing It (Rental Property)' },
                            { value: 'Its a Guesthouse', text: 'It\'s a Guesthouse' }
                        ],
                        required: true
                    }
                ],
                nextAction: askProposedValueForHomeAndContents
            },
            {
                type: 'input',
                botMessage: "What is your proposed insured value for the building?",
                inputs: [
                    { id: 'proposedInsuredValue', placeholder: 'Enter building value', type: 'number', key: 'proposedInsuredValue', required: true, min: 10000, step: 1000 }
                ],
                nextAction: askContentsValueForHomeAndContents
            },
            {
                type: 'input',
                botMessage: "What is the replacement cost of your contents/furniture?",
                inputs: [
                    { id: 'contentsValue', placeholder: 'Enter contents value', type: 'number', key: 'contentsValue', required: true, min: 1000, step: 100 }
                ],
                nextAction: calculateHomeQuote
            }
        ],
               
        houseContentsInsurance: [
            {
                type: 'loading',
                duration: 1500
            },
            // Personal details for House Contents Insurance
            {
                type: 'input',
                botMessage: "Let's get your details for House Contents Insurance. Please provide your information:",
                inputs: [
                    {
                        type: 'row',
                        rowInputs: [
                            { id: 'firstName', placeholder: 'First Name', type: 'text', key: 'firstName', required: true },
                            { id: 'surname', placeholder: 'Last Name', type: 'text', key: 'surname', required: true }
                        ]
                    },
                    {
                        type: 'row',
                        rowInputs: [
                            { id: 'phoneNumber', placeholder: 'Phone Number', type: 'tel', key: 'phoneNumber', required: true },
                            { id: 'email', placeholder: 'Email Address', type: 'email', key: 'email', required: true }
                        ]
                    }
                ],
                nextAction: displayHouseContentsInfoMessage
            },
            // Informational message
            {
                type: 'message',
                botMessage: "Before we get started, it is important that you know this….\n\nCover is provided for the contents of the building. This includes items such as your furniture. Fixtures and fittings such as carpets and fixed cupboards are covered when you insure the building(s)",
                nextAction: askReplacementCostForHouseContents
            },
            
            {
                type: 'input',
                botMessage: "What is the replacement cost of your furniture/property you want to insure?\n\nPlease ensure that the amount you enter is the replacement value.",
                inputs: [
                    { id: 'replacementCost', placeholder: 'Enter replacement cost', type: 'number', key: 'replacementCost', required: true, min: 1000, step: 100 }
                ],
                nextAction: calculateHouseContentsQuote // Direct to quote after this step
            }
        ]
    };

    

    // --- Fetch Car Data ---
    async function fetchCarData() {
        try {
            const response = await fetch('/bib/wp-json/bib/v1/cars');
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            carsData = await response.json();
            console.log('Car data loaded:', carsData);
            initializeChat(); // Make sure this function exists
        } catch (error) {
            console.error('Could not load car data:', error);
            mainContentArea.innerHTML = `
                <div class="bot-message-bubble">
                    <p>Error loading car data. Please try again later.</p>
                </div>`;
        }
    }

    fetchCarData();

    // --- Render Functions ---

    function renderCurrentStep() {
        mainContentArea.innerHTML = ''; // Clear previous content

        const currentStep = flows[currentFlow][currentStepIndex];

        if (!currentStep) {
            console.error("No step found for current flow and index.");
            initializeChat();
            return;
        }

        switch (currentStep.type) {
            case 'initial_options_with_toggle':
                renderInitialOptionsWithToggle(currentStep.botMessage, currentStep.initialOptions, currentStep.hiddenOptions);
                break;
            case 'input':
                renderInputForm(currentStep.botMessage, currentStep.inputs, currentStep.nextAction);
                break;
            case 'loading':
                renderLoadingScreen(currentStep.duration, () => {
                    currentStepIndex++;
                    renderCurrentStep();
                });
                break;
            case 'quote':
                renderQuoteResult(currentStep.data);
                break;
            case 'message':
                renderMessageDisplay(currentStep.botMessage, currentStep.nextAction);
                break;
        }
    }

    function renderInitialOptionsWithToggle(message, initialOpts, hiddenOpts) {
        let initialOptionsHtml = '';
        initialOpts.forEach(option => {
            initialOptionsHtml += `
                <div class="option-card" data-option="${option.dataOption}">
                    <div class="icon-gradient"></div>
                    <img src="${option.icon}" alt="${option.text}" class="option-icon">
                    <span>${option.text}</span>
                    <span class="arrow"><i class="fas fa-chevron-right"></i></span>
                </div>
            `;
        });

        let hiddenOptionsHtml = '';
        hiddenOpts.forEach(option => {
            hiddenOptionsHtml += `
                <div class="option-card" data-option="${option.dataOption}">
                    <div class="icon-gradient"></div>
                    <img src="${option.icon}" alt="${option.text}" class="option-icon">
                    <span>${option.text}</span>
                    <span class="arrow"><i class="fas fa-chevron-right"></i></span>
                </div>
            `;
        });

        mainContentArea.innerHTML = `
            <div class="bot-message-bubble">
                <p>${message}</p>
            </div>
            <div class="options-wrapper">
                <div class="options-row" id="initialOptionsRow">
                    ${initialOptionsHtml}
                </div>
                <div class="options-row hidden-options" id="hiddenOptionsRow" >
                    ${hiddenOptionsHtml}
                </div>
            </div>
        `;

        const toggleButton = document.getElementById('toggleOtherOptions');
        const hiddenRow = document.getElementById('hiddenOptionsRow');

        if (toggleButton && hiddenRow) {
            toggleButton.addEventListener('click', () => {
                if (hiddenRow.style.display === 'none') {
                    hiddenRow.style.display = 'flex';
                    toggleButton.classList.add('expanded');
                    toggleButton.style.display = 'none';
                }
            });
        }

        mainContentArea.querySelectorAll('.option-card').forEach(card => {
            card.addEventListener('click', () => {
                const selectedOption = card.dataset.option;
                handleOptionSelection(selectedOption);
            });
        });
    }

function renderInputForm(message, inputs, nextActionFunction) {
    // Add this line to inspect the inputs array when the function is called
    console.log("Inputs array received by renderInputForm:", inputs);

    let inputsHtml = '';
    inputs.forEach(inputDef => { 
        if (inputDef.type === 'row') {
            let rowContent = '';
            // Iterate through inputs within the row
            inputDef.rowInputs.forEach(input => {
                if (input.type === 'text' || input.type === 'number' || input.type === 'email' || input.type === 'tel') {
                    rowContent += `
                        <input
                            type="${input.type}"
                            id="${input.id}"
                            placeholder="${input.placeholder}"
                            ${input.required ? 'required' : ''}
                            ${input.min ? `min="${input.min}"` : ''}
                            ${input.step ? `step="${input.step}"` : ''}
                            autocomplete="off"
                        >
                    `;
                }
                // Add logic for other input types if they are expected within rows
            });
            inputsHtml += `<div class="input-row">${rowContent}</div>`;
        } else if (inputDef.type === 'text' || inputDef.type === 'number' || inputDef.type === 'email' || inputDef.type === 'tel') {
            // Existing logic for standalone text/number/email/tel inputs
            inputsHtml += `
                <input
                    type="${inputDef.type}"
                    id="${inputDef.id}"
                    placeholder="${inputDef.placeholder}"
                    ${inputDef.required ? 'required' : ''}
                    ${inputDef.min ? `min="${inputDef.min}"` : ''}
                    ${inputDef.step ? `step="${inputDef.step}"` : ''}
                    autocomplete="off"
                >
            `;
        } else if (inputDef.type === 'select') {
            if (inputDef.id === 'carMake') {
                const uniqueMakes = [...new Set(carsData.map(car => car.make))].sort();
                let optionsHtml = `<option value="">${inputDef.placeholder}</option>`;
                uniqueMakes.forEach(make => {
                    optionsHtml += `<option value="${make}">${make}</option>`;
                });
                inputsHtml += `
                    <select id="${inputDef.id}" ${inputDef.required ? 'required' : ''} autocomplete="off">
                        ${optionsHtml}
                    </select>
                `;
            } else {
                let optionsHtml = '<option value="">' + inputDef.placeholder + '</option>';
                inputDef.options.forEach(option => {
                    optionsHtml += `<option value="${option.value}">${option.text}</option>`;
                });
                inputsHtml += `
                    <select id="${inputDef.id}" ${inputDef.required ? 'required' : ''} autocomplete="off">
                        ${optionsHtml}
                    </select>
                `;
            }
        }
    });

    mainContentArea.innerHTML = `
        <div class="bot-message-bubble">
            <p>${message}</p>
        </div>
        <div class="form-elements-container">
            ${inputsHtml}
            <button class="next-button" id="nextButton">Next</button>
        </div>
    `;

    const carMakeSelect = document.getElementById('carMake');

    if (carMakeSelect) {
        // Populate the make dropdown
        const makes = [...new Set(carsData.map(car => car.make))].sort();

        makes.forEach(make => {
            const option = document.createElement('option');
            option.value = make;
            option.textContent = make;
            carMakeSelect.appendChild(option);
        });
    }


    document.getElementById('nextButton').addEventListener('click', () => {
        const formData = {};
        let allInputsValid = true;

        inputs.forEach(inputDef => { 
            let inputsToValidate = [];
            if (inputDef.type === 'row') {
                inputsToValidate = inputDef.rowInputs; 
            } else {
                inputsToValidate = [inputDef]; 
            }

            inputsToValidate.forEach(input => {
                // Defensive check: Ensure 'input' is a valid object before trying to access its properties
                if (!input || typeof input !== 'object') {
                    console.error("Invalid or undefined input object encountered during validation:", input);
                    allInputsValid = false; 
                    return; 
                }

                const inputElement = document.getElementById(input.id);
                if (inputElement) {
                    let value = inputElement.value.trim();

                    if (input.required && !value) {
                        allInputsValid = false;
                        alert(`Please fill in ${input.placeholder}.`);
                        return; // Exit inner loop
                    }

                    if (input.type === 'number') {
                        value = parseFloat(value);
                        if (isNaN(value) || (input.min && value < input.min)) {
                            allInputsValid = false;
                            alert(`Please enter a valid number for ${input.placeholder}.`);
                            return;
                        }
                    } else if (input.type === 'email') {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(value)) {
                            allInputsValid = false;
                            alert(`Please enter a valid email address for ${input.placeholder}.`);
                            return;
                        }
                    } else if (input.type === 'tel') {
                        const phoneRegex = /^[\d\s\-\(\)\+]+$/;
                        if (!phoneRegex.test(value) || value.replace(/[\s\-\(\)\+]/g, '').length < 7) {
                            allInputsValid = false;
                            alert(`Please enter a valid phone number for ${input.placeholder}.`);
                            return;
                        }
                    }

                    formData[input.key] = value;
                }
            });

            if (!allInputsValid) {
                return; // Exit outer loop early if an invalid input was found
            }
        });

        if (allInputsValid) {
            Object.assign(calculationData, formData);
            if (typeof nextActionFunction === 'function') {
                nextActionFunction();
            } else {
                console.error("nextActionFunction is not a valid function.");
                currentStepIndex++;
                renderCurrentStep();
            }
        }
    });
}

function renderLoadingScreen(duration, callback) {
    mainContentArea.innerHTML = `
        <div class="loading-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    setTimeout(callback, duration);
}

function renderMessageDisplay(message, nextActionFunction) {
    mainContentArea.innerHTML = `
        <div class="bot-message-bubble">
            <p>${message}</p>
        </div>
        <div class="form-elements-container">
            <button class="next-button" id="messageNextButton">Next</button>
        </div>
    `;

    document.getElementById('messageNextButton').addEventListener('click', () => {
        if (typeof nextActionFunction === 'function') {
            nextActionFunction();
        } else {
            console.error("nextActionFunction is not a valid function.");
            currentStepIndex++;
            renderCurrentStep();
        }
    });
}

function renderQuoteResult(data) {

    let finalQuote = 0;
    let termQuote = 0;
    let termLabel = "BI-ANNUAL";
    let breakdown = {};
    const stampDutyRate = 0.05;

    console.log("Current flow:", currentFlow);
    console.log("Data received:", data);

    if (currentFlow === 'carInsurance') {
        const premiumRate = 0.03;
        const annualMotorLevy = 10.8;

        const subTotal = data.proposedValue * premiumRate;
        const stampDuty = subTotal * stampDutyRate;

        finalQuote = subTotal + stampDuty + annualMotorLevy;
        termQuote = finalQuote / 3;
        termLabel = "TERM (4 Months)";

        breakdown = {
            premiumRate: premiumRate * 100,
            premiumAmount: subTotal,
            levyRate: 0,
            levyAmount: annualMotorLevy,
            stampDuty: stampDuty,
            totalPremium: finalQuote,
            termPremium: termQuote,
            termPremiumBasic: subTotal / 3,
            termLevy: annualMotorLevy / 3,
            termStampDuty: stampDuty / 3
        };

    } else if (currentFlow === 'homeOnly' || currentFlow === 'contentsOnly' || currentFlow === 'homeAndContents') {
        // Use the breakdown that was already calculated in calculateHomeQuote
        console.log("Using pre-calculated home breakdown:", calculationData.breakdown);
        finalQuote = calculationData.breakdown.totalPremium;
        termQuote = calculationData.breakdown.termPremium || (finalQuote / 2);
        termLabel = "BI-ANNUAL";
        breakdown = calculationData.breakdown;

    } else if (currentFlow === 'houseAndContentsInsurance') {
        const basePremium = 1000;
        const proposedInsuredValueFactor = data.proposedInsuredValue ? (data.proposedInsuredValue * 0.0005) : 0;
        const replacementCostFactor = data.replacementCost ? (data.replacementCost * 0.001) : 0;
        finalQuote = basePremium + proposedInsuredValueFactor + replacementCostFactor;
        termQuote = finalQuote / 2; 
        termLabel = "BI-ANNUAL";
        
        breakdown = {
            basePremium: basePremium,
            buildingFactor: proposedInsuredValueFactor,
            contentsFactor: replacementCostFactor,
            totalPremium: finalQuote,
            termPremium: termQuote
        };

    } else if (currentFlow === 'houseContentsInsurance') {
        const baseContentsPremium = 250;
        const replacementCostFactor = data.replacementCost ? (data.replacementCost * 0.0015) : 0;
        finalQuote = baseContentsPremium + replacementCostFactor;
        termQuote = finalQuote / 2; 
        termLabel = "BI-ANNUAL";
        
        breakdown = {
            basePremium: baseContentsPremium,
            contentsFactor: replacementCostFactor,
            totalPremium: finalQuote,
            termPremium: termQuote
        };
    }

    calculationData.breakdown = breakdown;
    calculationData.finalQuote = finalQuote;
    calculationData.termQuote = termQuote;
    calculationData.termLabel = termLabel;

    // Send email only once - remove duplicate calls
    sendQuoteEmail(termQuote, finalQuote, termLabel);

    mainContentArea.innerHTML = `
        <div class="quote-display-container">
            <div class="premium-options-row">
                <div class="premium-option active" id="yearlyOption">
                    <span class="premium-type">YEARLY</span>
                </div>
                <div class="premium-option" id="termOption">
                    <span class="premium-type">${termLabel}</span>
                </div>
            </div>
            <div class="premium-value-display">
                <span id="displayPremiumValue">${finalQuote.toFixed(2)}</span>
            </div>
            <div class="quote-message">
                <p>You can also get insurance cover for your businesses from us! Assets such as the building from which you operate; laptops, machinery and loss of profits can be covered by your insurance. Get in touch for more!</p>
            </div>
            <div class="quote-buttons-row">
                <button class="quote-action-button" id="downloadQuoteButton">DOWNLOAD QUOTE</button>
            </div>

        </div>
        <div class="form-elements-container">
            <button class="next-button" id="startNewQuote">Start New Quote</button>
        </div>
    `;


    const yearlyOption = document.getElementById('yearlyOption');
    const termOption = document.getElementById('termOption');
    const displayPremiumValue = document.getElementById('displayPremiumValue');

    yearlyOption.addEventListener('click', () => {
        yearlyOption.classList.add('active');
        termOption.classList.remove('active');
        displayPremiumValue.textContent = finalQuote.toFixed(2);
    });

    termOption.addEventListener('click', () => {
        termOption.classList.add('active');
        yearlyOption.classList.remove('active');
        displayPremiumValue.textContent = termQuote.toFixed(2);
    });

    document.getElementById('startNewQuote').addEventListener('click', initializeChat);

    document.getElementById('downloadQuoteButton').addEventListener('click', () => {
        console.log('PDF generation details for download:', calculationData);
    
        // --- PDF Generation Logic (using PDFMake) ---
    
        // Define styles for the PDF
        const styles = {
            header: {
                fontSize: 22,
                bold: true,
                margin: [0, 0, 0, 10]
            },
            subheader: {
                fontSize: 16,
                bold: true,
                margin: [0, 10, 0, 5]
            },
            tableHeader: {
                bold: true,
                fontSize: 10,
                color: 'black',
                fillColor: '#EEEEEE'
            },
            tableCell: {
                fontSize: 9
            },
            footer: {
                fontSize: 8,
                color: 'gray',
                margin: [0, 20, 0, 0]
            },
            quoteDetails: {
                fontSize: 10,
                margin: [0, 5, 0, 0]
            }
        };
    
        const currentDate = new Date();
        const submittedDateTime = currentDate.toLocaleString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    
        // Helper function to format currency
        const formatCurrency = (amount) => {
            return 'US$' + parseFloat(amount).toLocaleString(undefined, { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
            });
        };
    
        // Build the content array dynamically
        const content = [
            // Company Logo / Header
            {
                columns: [
                    {
                        image: logoBase64, 
                        width: 100,
                        alignment: 'left'
                    },
                    {
                        text: 'INSURANCE QUOTE',
                        style: 'subheader',
                        alignment: 'right',
                        width: '*'
                    }
                ],
                margin: [0, 0, 0, 20]
            },
    
            // Personal Details
            { text: 'Personal Details', style: 'subheader' },
            {
                style: 'quoteDetails',
                columns: [
                    { text: 'Name:', bold: true, width: 'auto' },
                    { text: data.firstName + ' ' + data.surname || '', width: '*' },
                    { text: 'Email:', bold: true, width: 'auto' },
                    { text: data.email || '', width: '*' },
                    { text: 'Phone:', bold: true, width: 'auto' },
                    { text: data.phoneNumber || '', width: '*' },
                ],
                columnGap: 10,
                margin: [0, 0, 0, 10]
            }
        ];
    
        // --- INSURANCE TYPE SPECIFIC DETAILS ---
    
        // Car Insurance Details
        if (currentFlow === 'carInsurance') {
            content.push(
                { text: 'Vehicle Details', style: 'subheader' },
                {
                    table: {
                        widths: ['*', '*', '*', '*', '*', '*'],
                        headerRows: 1,
                        body: [
                            [
                                { text: 'Registration', style: 'tableHeader' },
                                { text: 'Type of Cover', style: 'tableHeader' },
                                { text: 'Make', style: 'tableHeader' },
                                { text: 'Category', style: 'tableHeader' },
                                { text: 'Year', style: 'tableHeader' },
                                { text: 'Insured Value', style: 'tableHeader' }
                            ],
                            [
                                { text: data.vehicleRegistration || 'N/A', style: 'tableCell' }, 
                                { text: 'Comprehensive', style: 'tableCell' },
                                { text: data.carMake || '', style: 'tableCell' },
                                { text: data.carCategory || '', style: 'tableCell' },
                                { text: data.carYear || '', style: 'tableCell' },
                                { text: data.proposedValue ? formatCurrency(data.proposedValue) : '', style: 'tableCell' }
                            ]
                        ]
                    },
                    layout: 'lightHorizontalLines',
                    margin: [0, 0, 0, 20]
                }
            );
        }
    
        // Home Insurance Subcategories
        else if (currentFlow === 'homeOnly') {
            content.push(
                { text: 'Home Insurance Details (Building Only)', style: 'subheader' },
                {
                    table: {
                        widths: ['*', '*', '*'],
                        headerRows: 1,
                        body: [
                            [
                                { text: 'Insurance Type', style: 'tableHeader' },
                                { text: 'Use of Property', style: 'tableHeader' },
                                { text: 'Building Value', style: 'tableHeader' }
                            ],
                            [
                                { text: 'Home (Building Only)', style: 'tableCell' },
                                { text: calculationData.houseUse || '', style: 'tableCell' },
                                { text: calculationData.proposedInsuredValue ? formatCurrency(calculationData.proposedInsuredValue) : '', style: 'tableCell' }
                            ]
                        ]
                    },
                    layout: 'lightHorizontalLines',
                    margin: [0, 0, 0, 20]
                }
            );
        }
        else if (currentFlow === 'contentsOnly') {
            content.push(
                { text: 'Contents Insurance Details', style: 'subheader' },
                {
                    table: {
                        widths: ['*', '*'],
                        headerRows: 1,
                        body: [
                            [
                                { text: 'Insurance Type', style: 'tableHeader' },
                                { text: 'Contents Value', style: 'tableHeader' }
                            ],
                            [
                                { text: 'Contents Only', style: 'tableCell' },
                                { text: calculationData.contentsValue ? formatCurrency(calculationData.contentsValue) : '', style: 'tableCell' }
                            ]
                        ]
                    },
                    layout: 'lightHorizontalLines',
                    margin: [0, 0, 0, 20]
                }
            );
        }
        else if (currentFlow === 'homeAndContents') {
            content.push(
                { text: 'Home + Contents Insurance Details', style: 'subheader' },
                {
                    table: {
                        widths: ['*', '*', '*', '*'],
                        headerRows: 1,
                        body: [
                            [
                                { text: 'Insurance Type', style: 'tableHeader' },
                                { text: 'Use of Property', style: 'tableHeader' },
                                { text: 'Building Value', style: 'tableHeader' },
                                { text: 'Contents Value', style: 'tableHeader' }
                            ],
                            [
                                { text: 'Home + Contents', style: 'tableCell' },
                                { text: calculationData.houseUse || '', style: 'tableCell' },
                                { text: calculationData.proposedInsuredValue ? formatCurrency(calculationData.proposedInsuredValue) : '', style: 'tableCell' },
                                { text: calculationData.contentsValue ? formatCurrency(calculationData.contentsValue) : '', style: 'tableCell' }
                            ]
                        ]
                    },
                    layout: 'lightHorizontalLines',
                    margin: [0, 0, 0, 20]
                }
            );
        }
    
        // Legacy flows (keep for backward compatibility)
        else if (currentFlow === 'houseAndContentsInsurance') {
            content.push(
                { text: 'House & Contents Details', style: 'subheader' },
                {
                    table: {
                        widths: ['*', '*', '*'],
                        headerRows: 1,
                        body: [
                            [
                                { text: 'Use of Property', style: 'tableHeader' },
                                { text: 'Proposed Insured Value', style: 'tableHeader' },
                                { text: 'Contents Replacement Cost', style: 'tableHeader' }
                            ],
                            [
                                { text: calculationData.houseUse || '', style: 'tableCell' },
                                { text: data.proposedInsuredValue ? formatCurrency(data.proposedInsuredValue) : '', style: 'tableCell' },
                                { text: data.replacementCost ? formatCurrency(data.replacementCost) : '', style: 'tableCell' }
                            ]
                        ]
                    },
                    layout: 'lightHorizontalLines',
                    margin: [0, 0, 0, 20]
                }
            );
        }
        else if (currentFlow === 'houseContentsInsurance') {
            content.push(
                { text: 'House Contents Details', style: 'subheader' },
                {
                    table: {
                        widths: ['*', '*'],
                        headerRows: 1,
                        body: [
                            [
                                { text: 'Use of Property', style: 'tableHeader' },
                                { text: 'Contents Replacement Cost', style: 'tableHeader' }
                            ],
                            [
                                { text: calculationData.houseUse || '', style: 'tableCell' },
                                { text: data.replacementCost ? formatCurrency(data.replacementCost) : '', style: 'tableCell' }
                            ]
                        ]
                    },
                    layout: 'lightHorizontalLines',
                    margin: [0, 0, 0, 20]
                }
            );
        }
    
        // --- PREMIUM PAYMENT SECTION ---
        content.push(
            {
                text: 'Premium Payment',
                style: 'subheader'
            },
            {
                table: {
                    widths: ['*', '*'],
                    headerRows: 1,
                    body: [
                        [
                            { text: `Premium per ${termLabel.replace(' (4 Months)', '')}`, style: 'tableHeader' },
                            { text: 'Annual Premium', style: 'tableHeader' }
                        ],
                        [
                            { text: formatCurrency(termQuote), style: 'tableCell' },
                            { text: formatCurrency(finalQuote), style: 'tableCell' }
                        ]
                    ]
                },
                layout: 'lightHorizontalLines',
                margin: [0, 0, 0, 20]
            }
        );
    
        // --- PREMIUM BREAKDOWN SECTION ---
        content.push(
            {
                text: 'Premium Breakdown',
                style: 'subheader'
            }
        );
    
        // Different breakdown tables based on insurance type
        if (currentFlow === 'carInsurance') {
            content.push({
                table: {
                    widths: ['*', '*', '*', '*'], 
                    headerRows: 1,
                    body: [
                        [
                            { text: 'Description', style: 'tableHeader' },
                            { text: 'Rate / %', style: 'tableHeader' },
                            { text: 'Term Amount (US$)', style: 'tableHeader' },
                            { text: 'Annual Amount (US$)', style: 'tableHeader' } 
                        ],
                        [
                            { text: 'Basic Premium', style: 'tableCell' },
                            { text: (calculationData.breakdown?.premiumRate ? calculationData.breakdown.premiumRate + '%' : '-'), style: 'tableCell' },
                            { text: (calculationData.breakdown?.termPremiumBasic ? formatCurrency(calculationData.breakdown.termPremiumBasic) : 'US$0.00'), style: 'tableCell' },
                            { text: (calculationData.breakdown?.premiumAmount ? formatCurrency(calculationData.breakdown.premiumAmount) : 'US$0.00'), style: 'tableCell' }
                        ],
                        [
                            { text: 'LEVY', style: 'tableCell' },
                            { text: (calculationData.breakdown?.levyRate ? calculationData.breakdown.levyRate + '%' : '-'), style: 'tableCell' },
                            { text: (calculationData.breakdown?.termLevy ? formatCurrency(calculationData.breakdown.termLevy) : 'US$0.00'), style: 'tableCell' },
                            { text: (calculationData.breakdown?.levyAmount ? formatCurrency(calculationData.breakdown.levyAmount) : 'US$0.00'), style: 'tableCell' }
                        ],
                        [
                            { text: 'Stamp Duty', style: 'tableCell' },
                            { text: '-', style: 'tableCell' },
                            { text: (calculationData.breakdown?.termStampDuty ? formatCurrency(calculationData.breakdown.termStampDuty) : 'US$0.00'), style: 'tableCell' },
                            { text: (calculationData.breakdown?.stampDuty ? formatCurrency(calculationData.breakdown.stampDuty) : 'US$0.00'), style: 'tableCell' }
                        ],
                        [
                            { text: 'TOTAL', bold: true },
                            { text: '', style: 'tableCell' },
                            { text: (calculationData.breakdown?.termPremium ? formatCurrency(calculationData.breakdown.termPremium) : 'US$0.00'), bold: true },
                            { text: (calculationData.breakdown?.totalPremium ? formatCurrency(calculationData.breakdown.totalPremium) : 'US$0.00'), bold: true }
                        ]
                    ]
                },
                layout: 'lightHorizontalLines',
                margin: [0, 10, 0, 20]
            });
        }
        else if (currentFlow === 'homeOnly' || currentFlow === 'contentsOnly' || currentFlow === 'homeAndContents') {
            // Home insurance breakdown
            const breakdownBody = [
                [
                    { text: 'Description', style: 'tableHeader' },
                    { text: 'Rate / %', style: 'tableHeader' },
                    { text: 'Term Amount (US$)', style: 'tableHeader' },
                    { text: 'Annual Amount (US$)', style: 'tableHeader' } 
                ]
            ];
    
            if (currentFlow === 'homeOnly') {
                breakdownBody.push([
                    { text: 'Building Premium', style: 'tableCell' },
                    { text: '0.1%', style: 'tableCell' },
                    { text: formatCurrency(calculationData.breakdown?.termPremiumBasic || termQuote), style : 'tableCell' },
                    { text: formatCurrency(calculationData.breakdown?.premiumAmount || finalQuote), style: 'tableCell' }
                ]);
            }
            else if (currentFlow === 'contentsOnly') {
                breakdownBody.push([
                    { text: 'Contents Premium', style: 'tableCell' },
                    { text: '1.2%', style: 'tableCell' },
                    { text: formatCurrency(calculationData.breakdown?.termPremiumBasic || termQuote), style: 'tableCell'},
                    { text: formatCurrency(calculationData.breakdown?.premiumAmount || finalQuote), style: 'tableCell' }
                ]);
            }
            else if (currentFlow === 'homeAndContents') {
                breakdownBody.push(
                    [
                        { text: 'Building Premium', style: 'tableCell' },
                        { text: '0.1%', style: 'tableCell' },
                        { text: formatCurrency((calculationData.breakdown?.homePremiumAmount || 0) / 2), style: 'tableCell' },
                        { text: formatCurrency(calculationData.breakdown?.homePremiumAmount || 0), style: 'tableCell' }
                    ],
                    [
                        { text: 'Contents Premium', style: 'tableCell' },
                        { text: '1.2%', style: 'tableCell' },
                        { text: formatCurrency((calculationData.breakdown?.contentsPremiumAmount || 0) / 2), style: 'tableCell' },
                        { text: formatCurrency(calculationData.breakdown?.contentsPremiumAmount || 0), style: 'tableCell' }
                    ]
                );
            }
    
            // Add stamp duty and total
            breakdownBody.push(
                [
                    { text: 'Stamp Duty', style: 'tableCell' },
                    { text: '5%', style: 'tableCell' },
                    { text: formatCurrency(calculationData.breakdown?.termStampDuty || (termQuote * 0.05)), style: 'tableCell' },
                    { text: formatCurrency(calculationData.breakdown?.stampDuty || (finalQuote * 0.05)), style: 'tableCell' }
                ],
                [
                    { text: 'TOTAL', bold: true },
                    { text: '', style: 'tableCell' },
                    { text: formatCurrency(termQuote), bold: true },
                    { text: formatCurrency(finalQuote), bold: true }
                ]
            );
    
            content.push({
                table: {
                    widths: ['*', '*', '*', '*'], 
                    headerRows: 1,
                    body: breakdownBody
                },
                layout: 'lightHorizontalLines',
                margin: [0, 10, 0, 20]
            });
        }
    
        // --- FOOTER SECTION ---
        content.push(
            {
                columns: [
                    {
                        width: '50%',
                        stack: [
                            { text: 'Bright Insurance Brokers', bold: true, fontSize: 12 },
                            { text: ' ', margin: [0, 2] },
                            { text: 'Your Trusted Insurance Partner', fontSize: 10 },
                            { text: ' ', margin: [0, 2] },
                            { text: 'Harare:', bold: true, fontSize: 9 },
                            { text: '5th Floor Beverly Court,', fontSize: 9 },
                            { text: 'Corner Nelson Mandela and Simon V. Muzenda Street,', fontSize: 9 },
                            { text: 'P.O.Box 2226, Harare, Zimbabwe', fontSize: 9 },
                            { text: 'Contact: +263781165525', fontSize: 9, margin: [0, 5, 0, 0] },
                            { text: 'Email: info@brightzim.com', fontSize: 9 },
                            { text: ' ', margin: [0, 5] },
                            { text: 'Bulawayo:', bold: true, fontSize: 9 },
                            { text: '4th Floor Pioneer House,', fontSize: 9 },
                            { text: 'Corner Fife Street and 8th Avenue, Bulawayo', fontSize: 9 },
                            { text: 'Contact: +263 2922 70562-4', fontSize: 9, margin: [0, 5, 0, 0] },
                            { text: 'Email: info@brightzim.com', fontSize: 9 },
                        ]
                    },
                    {
                        width: '50%',
                        alignment: 'right',
                        text: `Submitted on ${submittedDateTime}`,
                        style: 'footer'
                    }
                ],
                margin: [0, 20, 0, 20]
            }
        );
    
        // Liability Limits for Car Insurance
        if (currentFlow === 'carInsurance') {
            content.push(
                { text: 'Automatic Liability Limits', style: 'subheader' },
                { text: 'Third Party Property Damage USD 20,000', style: 'quoteDetails' },
                { text: 'Third Party Bodily Injury/Death USD 20,000', style: 'quoteDetails' },
                { text: 'Passenger Liability USD 20,000', style: 'quoteDetails', margin: [0, 0, 0, 10] },
                { text: 'Automatic Own Damage Limits', style: 'subheader' },
                { text: 'Unspecified Car Radio limit 5% of value vehicle sum insured', style: 'quoteDetails' },
                { text: 'Medical Expenses 1% of vehicle value', style: 'quoteDetails' },
                { text: 'Towing fees Reasonable to the nearest garage...', style: 'quoteDetails' }
            );
        }
    
        const docDefinition = {
            content: content,
            styles: styles,
            defaultStyle: {
                font: 'Roboto'
            }
        };
    
        // Link fonts for pdfMake
        if (typeof pdfMake !== 'undefined' && typeof pdfFonts !== 'undefined') {
            pdfMake.vfs = pdfFonts.pdfMake.vfs;
            pdfMake.fonts = {
                Roboto: {
                    normal: 'Roboto-Regular.ttf',
                    bold: 'Roboto-Medium.ttf',
                    italics: 'Roboto-Italic.ttf',
                    bolditalics: 'Roboto-MediumItalic.ttf'
                }
            };
        }
    
        // Determine filename dynamically based on flow
        let filename = 'Insurance_Quote.pdf';
        if (currentFlow === 'carInsurance') {
            filename = `Car_Insurance_Quote_${data.surname || ''}.pdf`;
        } else if (currentFlow === 'homeOnly') {
            filename = `Home_Insurance_Quote_${data.surname || ''}.pdf`;
        } else if (currentFlow === 'contentsOnly') {
            filename = `Contents_Insurance_Quote_${data.surname || ''}.pdf`;
        } else if (currentFlow === 'homeAndContents') {
            filename = `Home_Contents_Insurance_Quote_${data.surname || ''}.pdf`;
        } else if (currentFlow === 'houseAndContentsInsurance') {
            filename = `House_Contents_Insurance_Quote_${data.surname || ''}.pdf`;
        } else if (currentFlow === 'houseContentsInsurance') {
            filename = `Contents_Insurance_Quote_${data.surname || ''}.pdf`;
        }
    
        saveQuoteToDatabase(data);
    
        // Generate PDF first
        const pdfDocGenerator = pdfMake.createPdf(docDefinition);
        
        // Get PDF as base64 for email attachment
        pdfDocGenerator.getBase64((pdfBase64) => {
            // Send email with PDF data
            const formData = new FormData();
            formData.append('action', 'send_quote_email');
            formData.append('security', bib_data.ajax_nonce);
            formData.append('form_data', JSON.stringify(calculationData)); 
            formData.append('currentFlow', currentFlow);
            formData.append('termLabel', termLabel);
            formData.append('termQuote', termQuote);
            formData.append('finalQuote', finalQuote);
            formData.append('pdf_base64', pdfBase64); // Add PDF as base64
            
            fetch(bib_data.ajax_url, {
                method: 'POST',
                body: formData 
            })
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    console.warn("Quote email failed:", data.data?.message);
                } else {
                    console.log("Emails sent successfully");
                }
            })
            .catch(error => {
                console.error("Error sending emails:", error);
            });
        });
    
        pdfMake.createPdf(docDefinition).download(filename);
        showConfirmationPopup();
    });
}


function initializeChat() {
    currentFlow = 'initial';
    currentStepIndex = 0;
    calculationData = {};
    renderCurrentStep();
}

function handleOptionSelection(selectedOption) {
    switch (selectedOption) {
        case 'Car':
            currentFlow = 'carInsurance';
            break;
        case 'Home Insurance':
            currentFlow = 'homeInsurance';
            break;
        case 'House & Contents':
            currentFlow = 'houseAndContentsInsurance';
            currentStepIndex = 0;
            break;
        case 'House Contents':
            currentFlow = 'houseContentsInsurance';
            currentStepIndex = 0;
            break;
        case 'Travel Insurance':
        case 'Agriculture Insurance':
        case 'Other Insurance':
            // Redirect to WhatsApp
            const message = encodeURIComponent(`Hello! I'm interested in ${selectedOption}. Please provide me with more information.`);
            window.open(`https://wa.me/263781165525?text=${message}`, '_blank');
            return; // Don't proceed with chat flow
        default:
            console.error("Unknown option selected:", selectedOption);
            initializeChat();
            return;
    }
    currentStepIndex = 0;
    renderCurrentStep();
}

function generateYearOptions(count) {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: count }, (_, i) => {
        const year = currentYear - i;
        return { value: year, text: year };
    });
}

// --- Initial Setup ---

async function saveQuoteToDatabase(data) {
    try {
        const response = await fetch('/bib/wp-json/bib/v1/save-quote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_name: data.firstName || 'Unknown',         // Required
                surname: data.surname || '',
                email: data.email || '',
                phone_number: data.phone_number || '',
                insurance_type: data.insurance_type || 'Comprehensive', // Required
                annual_premium: data.annual_premium || 0,
                term_premium: data.term_premium || 0,
                vehicle_registration: data.vehicleRegistration || '',
                details: data.details || ''
            })
        });

        const result = await response.json();
        if (result.success) {
            console.log('Quote saved!');
        } else {
            console.error('Error saving quote:', result);
        }
    } catch (err) {
        console.error('Request failed:', err);
    }
}

function sendQuoteEmail(termQuote, finalQuote, termLabel) {
    const formData = new FormData();
    formData.append('action', 'send_quote_email');
    formData.append('security', bib_data.ajax_nonce);
    formData.append('form_data', JSON.stringify(calculationData)); 
    formData.append('currentFlow', currentFlow);
    formData.append('termLabel', termLabel);
    formData.append('termQuote', termQuote);
    formData.append('finalQuote', finalQuote);

    fetch(bib_data.ajax_url, {
        method: 'POST',
        body: formData 
    })
    .then(response => response.json())
    .then(data => {
    if (!data.success) {
        console.warn("Quote email failed:", data.data.message);
    }
})
}

const siteHomeUrl = bib_data.bibhome;
// Close button functionality
if (closeButton) {
    closeButton.addEventListener('click', () => {
        window.location.href = siteHomeUrl;
    });
}



// pop up  functionality  


function showConfirmationPopup() {
    // Create popup overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    `;

    // Create popup content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.cssText = `
        background: linear-gradient(135deg, #e3f2fd, #e8f5e9, #ffffff);
        padding: 30px;
        border-radius: 15px;
        max-width: 400px;
        width: 90%;
        text-align: center;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        transform: translateY(-20px);
        transition: transform 0.3s ease;
    `;

    // Create popup HTML structure
    modalContent.innerHTML = `
        <div class="modal-icon" style="font-size: 48px; color: #3498db; margin-bottom: 15px;">✓</div>
        <h2 class="modal-title" style="color: #2c3e50; margin-bottom: 15px; font-size: 22px;">Thank You!</h2>
        <p class="modal-message" style="color: #34495e; margin-bottom: 25px; line-height: 1.5;">
            Thank you for your inquiry. Our team will get in touch with you shortly.
        </p>
        <button class="modal-button" id="closeModalButton" style="
            background: linear-gradient(135deg, #3498db, #2ecc71);
            color: white;
            border: none;
            padding: 10px 25px;
            border-radius: 50px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
        ">Close</button>
    `;

    // Append elements
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    // Show popup with animation
    setTimeout(() => {
        modalOverlay.style.opacity = '1';
        modalOverlay.style.visibility = 'visible';
        modalContent.style.transform = 'translateY(0)';
    }, 100);

    // Close button functionality
    const closeButton = modalContent.querySelector('#closeModalButton');
    closeButton.addEventListener('click', () => {
        modalOverlay.style.opacity = '0';
        modalOverlay.style.visibility = 'hidden';
        setTimeout(() => {
            if (modalOverlay.parentNode) {
                modalOverlay.parentNode.removeChild(modalOverlay);
            }
        }, 300);
    });

    // Close when clicking outside the content
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.style.opacity = '0';
            modalOverlay.style.visibility = 'hidden';
            setTimeout(() => {
                if (modalOverlay.parentNode) {
                    modalOverlay.parentNode.removeChild(modalOverlay);
                }
            }, 300);
        }
    });
}
});
