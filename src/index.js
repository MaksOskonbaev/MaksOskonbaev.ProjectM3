const currencyStr =
  "EUR,CHF,NOK,CAD,RUB,GBP,MXN,CNY,ISK,KRW,HKD,CZK,BGN,BRL,USD,IDR,SGD,PHP,RON,HUF,ILS,THB,SEK,NZD,AUD,DKK,HRK,PLN,TRY,INR,MYR,ZAR,JPY";

window.addEventListener("load", () => init());
function init() {
  const currencyArr = currencyStr.split(",");

  const blocks = [];

  function request() {
    API.request(blocks[0].curency, blocks[1].curency, response);
  }

  function response(rates) {
    const rate = rates[blocks[1].curency];
    blocks[1].input.value = rate * blocks[0].input.value;
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
      const curency0 = blocks[0].curency;
      const curency1 = blocks[1].curency;
      blocks[0].setCurency(curency1);
      blocks[1].setCurency(curency0);
      request();
  });
}

class CurrencyInput {
  constructor(inputId, currencyList, defaultCurency, request) {
    this.curency = defaultCurency;

    const block = document.querySelector(`#${inputId}`);
    const select = block.querySelector("select");

    const btns = block.querySelectorAll(".btn:not(select)");


    select.addEventListener("change", () => {
      this.curency = select.value;
      block.querySelector(".selected").classList.remove("selected");
      select.classList.add("selected");
      request();
    });

    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        block.querySelector(".selected").classList.remove("selected");
        btn.classList.add("selected");
        this.curency = btn.innerText;
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

    input.addEventListener('blur', () => {
      request();
    });

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
    });

    this.container  = block;
    this.input      = input;
    this.btns       = btns;
    this.select     = select
  }

  setCurency(curency){
    this.container.querySelector('.selected').classList.remove('selected');
      
    const btn = [...this.btns].find(btn => btn.innerText === curency);
    if(btn){
      btn.classList.add('selected');
    } else {
      const options = this.select.querySelectorAll('option');
      const option = [...options].find(option => option.value === curency);
      option.selected = true;
      this.select.classList.add('selected');
    }
    this.curency = curency;
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
