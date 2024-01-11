const API_BASE_URL = 'http://localhost:5000'

const fromSelect = document.getElementById('from_select');
const toSelect = document.getElementById('to_select');
populateSelectTags(fromSelect);
populateSelectTags(toSelect);

const fromInput = document.getElementById('from_input');
const toInput = document.getElementById('to_input');

fromInput.addEventListener('input', async () => {
    if (fromInput.value === '') return ;
    const convertedValueResult = await (await fetch(`${API_BASE_URL}/api/convert?fromCode=${fromSelect.value}&fromAmount=${fromInput.value}&toCode=${toSelect.value}`)).json();

    if (convertedValueResult.isError){
        console.log(convertedValueResult.message);
        return ;
    }

    toInput.value = convertedValueResult.data.toAmount;
});

toInput.addEventListener('input', async () => {
    if (toInput.value === '') return ;
    const convertedValueResult = await (await fetch(`${API_BASE_URL}/api/convert?fromCode=${toSelect.value}&fromAmount=${toInput.value}&toCode=${fromSelect.value}`)).json();

    if (convertedValueResult.isError){
        console.log(convertedValueResult.message);
        return ;
    }

    fromInput.value = convertedValueResult.data.toAmount;
});

const notificationBtn = document.getElementById('add_notification_btn');
const notificationPopup = document.getElementById('notification_popup');
notificationBtn.addEventListener('click', () => {
    notificationPopup.hidden = false;
});

document.addEventListener('click', event => {
    if (event.target == notificationBtn) return ;
    notificationPopup.hidden = true;
});

applyCssForNotificationIcon();

function applyCssForNotificationIcon(){
    const notificationDiv = document.getElementById('add_notification_div');
    notificationDiv.style.width = notificationDiv.offsetHeight + 'px';
}

async function populateSelectTags(selectTag){
    const currencies = (await (await fetch(`${API_BASE_URL}/api/currencies`)).json()).data.currencyCodes;
    for (let currency in currencies){
        const optionTag = document.createElement('option');
        optionTag.value = currency;
        optionTag.innerText = currency;
        selectTag.appendChild(optionTag);
    }
}

function setDefaultCurrency(){
    navigator.geolocation.getCurrentPosition(pos => {
        console.log(pos);
    }, err => {
        console.log(err);
    });
}