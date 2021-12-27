const CURRENCY_SYMBOLS = ['USD', 'AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BRL', 'BSD', 'BTN', 'BWP', 'BYN', 'BZD', 'CAD', 'CDF', 'CHF', 'CLP', 'CNY', 'COP', 'CRC', 'CUC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'FOK', 'GBP', 'GEL', 'GGP', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HRK', 'HTG', 'HUF', 'IDR', 'ILS', 'IMP', 'INR', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KID', 'KMF', 'KRW', 'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRU', 'MUR', 'MVR', 'MWK', 'MXN', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLL', 'SOS', 'SRD', 'SSP', 'STN', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TVD', 'TWD', 'TZS', 'UAH', 'UGX', 'UYU', 'UZS', 'VES', 'VND', 'VUV', 'WST', 'XAF', 'XCD', 'XDR', 'XOF', 'XPF', 'YER', 'ZAR', 'ZMW'];

const left = document.getElementById('left');
const right = document.getElementById('right');
const container = document.getElementById('container');
const data_text = document.getElementById('data');
const swap_button = document.getElementById('swap');


left.addEventListener('keypress', search_results);
left.addEventListener('click', reset);
left.addEventListener('keypress', validate_entry);

right.addEventListener('keypress', search_results);
right.addEventListener('click', reset);
right.addEventListener('keypress', validate_entry);
container.addEventListener('click', reset_results);
swap_button.addEventListener('click', validate_entry);

function swap() {
    let temp = left.value;
    left.value = right.value;
    right.value = temp;
}

function reset(event) {
    console.l
    event.srcElement.value = '';
    reset_results();
}

function validate_entry(event) {
    const opposite = {'left': right, 'right': left};
    if (event.type === 'keypress') {
        let new_value = event.srcElement.value + event.key;
        let opposite_value = opposite[event.srcElement.id].value;
        if (new_value.length === 3 && opposite_value.length === 3) {
            if (CURRENCY_SYMBOLS.includes(new_value) && CURRENCY_SYMBOLS.includes(opposite_value)) {
                request_data();
            }
        }
    } else if (event.type === 'click') {
        if (left.value.length === 3 && right.value.length === 3) {
            if (CURRENCY_SYMBOLS.includes(left.value) && CURRENCY_SYMBOLS.includes(right.value)) {
                request_data();
            }
        }
    }
}

function request_data() {
    const base = left.value;
    const URL = `https://open.er-api.com/v6/latest/${base}`;
    fetch(URL)
        .then(response => response.text())
        .then(data => display_data(JSON.parse(data)));
}

function display_data(data) {
    console.log(left.value, right.value);
    let display = `1 ${left.value} → ${data.rates[right.value].toFixed(2)} ${right.value}`
    data_text.innerHTML = display;
}

function search_results(event) {
    const search = event.srcElement.value.length == 0 ? event.key.toUpperCase() : (event.srcElement.value + event.key).toUpperCase()
    let results = CURRENCY_SYMBOLS.filter(s => s.includes(search));

    if (results.length > 5) {
        results = results.slice(0, 5);
    }

    const result_list = document.getElementById('results');
    reset_results()
    
    results.forEach(result => {
        let new_result = document.createElement('li');
        new_result.classList.add('result');
        new_result.innerHTML = result;
        
        
        new_result.left = true;

        if (event.srcElement.id === 'right') {
            new_result.right = true;
            new_result.left = false;

            result_list.style.gridColumn = '3';
            result_list.style.left = '-40px'
        }
        new_result.addEventListener('click', fill_input);
        new_result.addEventListener('click', validate_entry);
        result_list.appendChild(new_result);
    });
}

function fill_input(event) {
    let fill = event.srcElement.innerHTML;

    if (event.currentTarget.left) {
        left.value = fill;
    } else {
        right.value = fill;
    }
    reset_results();
}

function reset_results() {
    const result_list = document.getElementById('results');
    result_list.style.gridColumn = '1';
    result_list.style.left = '-7px'

    while (result_list.firstChild) {
        result_list.removeChild(result_list.lastChild);
    }
}


