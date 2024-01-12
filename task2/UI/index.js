const API_BASE_URL = 'http://localhost:5000'

const fromSelect = document.getElementById('from_select');
const toSelect = document.getElementById('to_select');
const fromInput = document.getElementById('from_input');
const toInput = document.getElementById('to_input');
const notificationBtn = document.getElementById('add_notification_btn');
const notificationPopup = document.getElementById('notification_popup');
const rateAlertSelect = document.getElementById('cur_code_select');
const rateAlertForm = notificationPopup.querySelector('form');

populateSelectTags(fromSelect);
populateSelectTags(toSelect);
populateSelectTags(rateAlertSelect);
changeNotificationPopupElemSize(0.08);
applyCssForNotificationIcon();

rateAlertForm.addEventListener('submit', async event => {
    const email = rateAlertForm.querySelector('#email_input').value;
    const curCode = rateAlertForm.querySelector('#cur_code_select').value;
    const rate = rateAlertForm.querySelector('#rate_input').value;
    const notifyWhenGoAbove = rateAlertForm.querySelector('#radio_when_go_above').checked;

    const result = await fetch(`${API_BASE_URL}/api/notify`, {
        method: "POST",
        body: JSON.stringify({
            email,
            curCode,
            rate,
            notifyWhenGoAbove
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });

    console.log(await result.json());
});



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

notificationBtn.addEventListener('click', event => {
    if (notificationPopup.hidden) event.ignoreByDocument = true;
    notificationPopup.hidden = false;

    for (let elem of document.body.children){
        if (elem.closest('#notification_popup')) continue;
        elem.style.filter = 'blur(5px)';
    }
});

document.addEventListener('click', event => {
    if (event.ignoreByDocument) return ;
    if (event.target.closest('#notification_popup')) return ;

    notificationPopup.hidden = true;
    for (let elem of document.body.children){
        if (elem.closest('#notification_popup')) continue;
        elem.style.filter = 'blur(0px)';
    }
});

function changeNotificationPopupElemSize(ratio){
    const prevHiddenState = notificationPopup.hidden;
    if (prevHiddenState) notificationPopup.hidden = false;

    for (let elem of rateAlertForm.children){
        elem.style.height = notificationPopup.offsetHeight * ratio + 'px';
    }

    notificationPopup.hidden = prevHiddenState;
}

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