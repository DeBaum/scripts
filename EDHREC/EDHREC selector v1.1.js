// ==UserScript==
// @name         EDHREC commander set builder
// @namespace    https://edhrec.com/
// @version      1.1
// @description  Create commander sets on EDHREC
// @author       DeBaum
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @require      https://unpkg.com/mobx@3.4.1/lib/mobx.umd.js
// @match        https://edhrec.com/commanders/*
// @match        https://edhrec.com/cards/*
// @match        https://edhrec.com/top/*
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
/* jshint ignore:end */
    /* jshint esnext: false */
    /* jshint esversion: 6 */

(() => {
  // INIT
  const state = mobx.observable({
    higlightColor: "#ff0000",
    cardList: [],
    storeUrl: "https://www.cardmarket.com/de/Magic/MainPage/showSearchResult?searchFor=$0"
  });

  mobx.autorun(setStyle);
  loadState();
  processCards();
  mobx.autorun(saveState);
  const $panel = addPanel();
  addEvents($panel);

  // FUNCTIONS
  function saveState() {
    localStorage.setItem("set-builder", JSON.stringify(state));
  }

  function loadState() {
    let loaded = localStorage.getItem("set-builder");
    if (loaded) {
      try {
        loaded = JSON.parse(loaded);
        Object.assign(state, loaded);
      } catch (ignored) {
        localStorage.removeItem("set-builder");
      }
    }
  }

  function addEvents($panel) {
    $(".card").on("contextmenu", e => {
      e.preventDefault();
      toggleCard($(e.currentTarget));
    });

    $panel.find(".panel-heading").on("click", (e) => {
      $(e.target).closest(".panel").find(".panel-body").slideToggle();
    });

    $panel.find(".btn.db-clear").on("click", e => {
      const { cardList } = state;
      mobx.runInAction(() => {
        while (cardList.length) {
          cardList.pop();
        }
        $(".card").removeClass("selected");
      });
    });

    $panel.find(".db-color-input input").on("change", (e) => {
      state.higlightColor = $(e.target).val();
    });

    $panel.find("textarea").on("focus", (e) => $(e.target).select());

    const $textarea = $panel.find("textarea");
    const $count = $panel.find(".count");
    mobx.autorun(() => {
      const { cardList } = state;
      $textarea.val(cardList.map(e => `1 ${e}`).join("\n"));
      $count.html(cardList.length);
    });
  }

  function toggleCard($elm) {
    const { cardList } = state;
    $elm.toggleClass("selected");
    const cardListEntry = getCardName($elm);
    if ($elm.is(".selected")) {
      cardList.push(cardListEntry);
    } else {
      cardList.splice(cardList.indexOf(cardListEntry), 1);
    }
  }

  function getCardName($elm) {
    let name = $elm.closest(".panel").find("h3").text();
    if (!name) {
      name = $elm.closest(".nw").find(".nwname").text();
    }
    if (name.includes("//")) {
      name = name.split(" // ")[0];
    }
    return name;
  }

  function processCards() {
    $(".card").each((i, elm) => {
      const $card = $(elm);
      const cardName = getCardName($card);

      if (state.cardList.indexOf(cardName) > -1) {
        $card.addClass("selected");
      }

      $card.find(".price a").attr("href", state.storeUrl.replace("$0", cardName));
    });
  }

  function addPanel() {
    const $panel = $(`
      <div class="panel panel-builder panel-default recentpanel">
        <div class="panel-heading">
          <h3 class="panel-title">Deck Builder</h3>
        </div>
        <div class="panel-body">
          <div class="form-group clearfix">
            <span class="count">0</span> Ausgewählt
            <div class="btn-group pull-right">
              <button class="btn btn-default db-color-input">
                <input type="color" value="${state.higlightColor}" />
              </button>
              <button class="btn btn-danger db-clear">Löschen</button>
            </div>
          </div>
          <div class="form-group">
            <textarea readonly class="form-control"></textarea>
          </div>
        </div>
      </div>
    `);

    $("body").append($panel);

    return $panel;
  }

  function setStyle() {
    let style = $("#db-style");
    if (style.length == 0) {
      $("head").append(`<style id="db-style">`);
      style = $("#db-style");
    }

    style.html(`
      .panel.panel-builder {
        position: fixed;
        z-index: 10;
        right: 6px;
        top: 60px;
        width: 500px;
      }

      .panel-builder textarea {
        max-width: 100%;
        min-width: 100%;
      }

      .db-color-input {
        padding-top: 4px;
        padding-bottom: 4px;
      }

      .db-color-input input {
        height: 24px;
        min-height: 24px;
        max-height: 24px;
        border: none;
        padding: 0;
        background: transparent;
      }

      .selected img {
        border-radius: 9px;
        box-shadow: 0 0 8px 2px ${state.higlightColor};
      }
    `);
  }
})();

/* jshint ignore:start */
]]></>).toString();
var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
eval(c.code);
/* jshint ignore:end */