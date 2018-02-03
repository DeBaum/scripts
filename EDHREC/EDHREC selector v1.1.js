// ==UserScript==
// @name         EDHREC commander set builder
// @namespace    https://edhrec.com/
// @version      1.1
// @description  Create commander sets on EDHREC
// @author       DeBaum
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @require      https://unpkg.com/mobx@3.4.1/lib/mobx.umd.js
// @require      https://unpkg.com/lodash@4.17.4/lodash.min.js
// @match        https://edhrec.com/commanders/*
// @match        https://edhrec.com/cards/*
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
    cardList: []
  })
  const commanderName = $(".cardpanel2 h3").text();

  mobx.autorun(setStyle);
  mobx.autorun(saveCards);
  const $panel = addPanel();
  addEvents($panel);

  // FUNCTIONS
  function saveCards() {
    localStorage.setItem(commanderName, JSON.stringify(state.cardList));
  }

  function addEvents($panel) {
    $(".card").on("contextmenu", e => {
      e.preventDefault();
      toggleCard($(e.currentTarget));
    });

    $panel.find(".panel-heading").on("click", (e) => {
      $(e.target).closest(".panel").find(".panel-body").slideToggle();
    });

    $panel.find(".btn").on("click", e => {
      const { cardList } = state
      mobx.runInAction(() => {
        while (cardList.length) {
          cardList.pop();
        }
        $(".card").removeClass("selected");
      });
    });

    $panel.find("textarea").on("focus", (e) => $(e.target).select());

    const $textarea = $panel.find("textarea");
    const $count = $panel.find(".count");
    mobx.autorun(() => {
      const { cardList } = state
      $textarea.val(cardList.join("\n"));
      $count.html(cardList.length);
    });
  }

  function toggleCard($elm) {
    const { cardList } = state;
    $elm.toggleClass("selected");
    const listName = getCardString($elm.parent());
    if ($elm.is(".selected")) {
      cardList.push(listName);
    } else {
      cardList.splice(cardList.indexOf(listName), 1);
    }
  }

  function getCardString($elm) {
    let cardName = $elm.find(".nwname").text();
    const imgSrc = $elm.find(".oneimage, .frontimage").attr("src");
    const [_, set, setId] = imgSrc.match(/\/([^\/]+?)\/([^\/]+?)a?\.jpg\?/);

    if (cardName.includes("//")) {
      cardName = cardName.split(" // ")[0];
    }
    if (!cardName) {
      cardName = commanderName;
    }

    return `1 [${set}:${setId}] ${cardName}`;
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
            <button class="btn btn-danger pull-right">Löschen</button>
          </div>
          <div class="form-group">
            <textarea readonly class="form-control"></textarea>
          </div>
        </div>
      </div>
    `);

    $panel.insertAfter($(".panel").last());

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
        right: 6px;
        top: 60px;
        width: 500px;
      }

      .panel-builder textarea {
        max-width: 100%;
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