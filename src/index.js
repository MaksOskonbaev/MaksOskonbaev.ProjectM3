const currencyStr =
  "EUR,CHF,NOK,CAD,RUB,GBP,MXN,CNY,ISK,KRW,HKD,CZK,BGN,BRL,USD,IDR,SGD,PHP,RON,HUF,ILS,THB,SEK,NZD,AUD,DKK,HRK,PLN,TRY,INR,MYR,ZAR,JPY";

window.addEventListener("load", () => init());
function init() {
  const currencyArr = currencyStr.split(",");

  const blocks = [];

  function request() {
    API.request(blocks[0].value, blocks[1].value, response);
  }

  function response(rates) {
    const rate = rates[blocks[1].value];
    blocks[1].input.value = rate * blocks[0].input.value;
    console.log(rates);
    console.log(blocks[1].input.value, blocks[0].input.value);
  }

  ["RUB", "USD"].forEach((currency, index) => {
    const currencyInput = new CurrencyInput(
      `block-${index + 1}`,
      currencyArr,
      currency,
      request
    );
    blocks.push(currencyInput);
  });
    
    const btnReverse = document.querySelector('#btn-revers');
    btnReverse.addEventListener(`click`, () => {
       const val0 = blocks[0].value;
       const val1 = blocks[1].value;
       blocks[0].setValue(val1);
       blocks[1].setValue(val0);
    });
    
    
}

class CurrencyInput {
  constructor(inputId, currencyList, defaultValue, request) {
    this.value = defaultValue;

    const block = document.querySelector(`#${inputId}`);
    const select = block.querySelector("select");

    const btns = block.querySelectorAll(".btn:not(select)");


    select.addEventListener("change", () => {
      this.value = select.value;
      block.querySelector(".selected").classList.remove("selected");
      select.classList.add("selected");
      request();
    });

    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        block.querySelector(".selected").classList.remove("selected");
        btn.classList.add("selected");
        this.value = btn.innerText;
        request();
      });
    });

    currencyList.forEach((currencyText) => {
      const option = document.createElement("option");
      option.value = currencyText;
      option.innerText = currencyText;
      select.append(option);
    });

    const input = block.querySelector("input");
    this.input = input;

    function alerts(value) {
      const alertInner = block.querySelector(".alert-inner");
      const alert = block.querySelector(".alert");

      if (value.match(/^[0-9.,]*$/) && value !== "") {
        if (alertInner.classList.contains("have")) {
          alert.remove();
          alertInner.classList.remove("have");
        }

        return value.replace(/,/g, ".");
      } else {
        let msg = document.createElement("p");
        msg.classList.add("alert");
        msg.innerHTML = "неверные данные";
        if (!alertInner.classList.contains("have")) {
          alertInner.append(msg);
          alertInner.classList.add("have");
        }
      }
    }

    input.addEventListener("change", () => {
      this.value = input.value;
      console.log(alerts(this.value));
    });

    this.container = block;
    this.btns = btns;
    this.select = select
  }

  setValue(value){
      const btn = [...this.btns].find(btn => btn.innerText === value);
      if(btn){
          btn.click();
      } else {
          const options = this.select.querySelectorAll('option');
          const option = [...options].find(option => option.value === value);
          option.selected = true;
          this.container.querySelector('.selected').classList.remove('selected');
          this.select.classList.add('selected');
      }
      this.value = value;

  }
}

const API = {
  request(base, symbols, callback) {
    fetch(
      `https://api.exchangerate.host/latest?base=${base}&symbols=${symbols}`
    )
      .then((res) => res.json())
      .then((data) => {
        callback(data.rates);
      });
  },
};
