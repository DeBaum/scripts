// ==UserScript==
// @name         EDHREC commander set builder
// @namespace    https://edhrec.com/
// @version      1.0
// @description  Create commander sets on EDHREC
// @author       DeBaum
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @require      https://unpkg.com/mobx@3.4.1/lib/mobx.umd.js
// @match        https://edhrec.com/commanders/*
// ==/UserScript==

/* jshint ignore:start */
var inline_src = (<><![CDATA[
/* jshint ignore:end */
    /* jshint esnext: false */
    /* jshint esversion: 6 */

(() => {
  // CONSTS
  const higlightColor = "#00ff00";

  // INIT
  const cardList = mobx.observable([]);
  const commanderName = $(".cardpanel2 h3").text();

  addStyle();
  mobx.autorun(saveCommander);
  const $panel = addPanel();
  addEvents($panel);

  // FUNCTIONS
  function saveCommander() {
    localStorage.setItem(commanderName, JSON.stringify(cardList));
  }

  function addEvents($panel) {
    $(".card").on("contextmenu", e => {
      e.preventDefault();
      toggleCard($(e.currentTarget));
    });

    $panel.find(".btn").on("click", e => {
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
      $textarea.val(cardList.join("\n"));
      $count.html(cardList.length);
    });
  }

  function toggleCard($elm) {
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
      <div class="panel panel-default recentpanel">
        <div class="panel-heading">
          <h3 class="panel-title">Deck Builder</h3>
        </div>
        <div class="panel-body">
          <div class="form-group clearfix">
            <span class="count">0</span>
            <button class="btn btn-danger pull-right">Löschen</button>
          </div>
          <div class="form-group">
            <textarea readonly class="form-control">inhalt</textarea>
          </div>
        </div>
      </div>
    `);

    $panel.insertAfter($(".panel").last());

    return $panel;
  }

  function addStyle() {
    $("head").append(`
      <style>
        .selected img {
          border-radius: 9px;
          box-shadow: 0 0 8px 2px ${higlightColor};
        }
      </style>
    `);
  }
})();

/* jshint ignore:start */
]]></>).toString();
var c = Babel.transform(inline_src, { presets: [ "es2015", "es2016" ] });
eval(c.code);
/* jshint ignore:end */