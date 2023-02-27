let goods;
let val = "";
let rowOnPage = 9;
let visibilityIntervalPage = 5;
let searchResult = [];
window.addEventListener("DOMContentLoaded", updateData);
const availableScreenHeight = window.screen.availHeight;
alert("availableScreenHeight " + availableScreenHeight);

let input = document.querySelector("#input");
input.oninput = elasticSearch;

async function updateData() {
  // console.log("Load price list from https://ann-226.github.io/PWA/SofaroTovar.json");

  try {
    let response = await fetch("https://ann-226.github.io/PWA/SofaroTovar.json");

    if (response.ok) {
      const data = await response.json();
      goods = data.price;

      console.log("from UpdateData, goods.length=" + goods.length);
      if (goods.length > 0) {
        updateList(goods, "", 0, rowOnPage);
        pagination(1, visibilityIntervalPage, Math.ceil(goods.length / rowOnPage));
      }
    }
  } catch (error) {
    console.log(error);
  }
}

function updateList(goods, mark = "", start, rowOnPage) {
  let tbody = document.querySelector(".list");
  tbody.innerHTML = "";
  let tmpArray = [];
  tmpArray = goods.slice(start, start + rowOnPage);

  table1.hidden = false;
  rowOnPage = rowOnPage > goods.length ? goods.length : rowOnPage;

  for (let i = 0; i < tmpArray.length; i++) {
    let name = tmpArray[i][1];
    if (mark != "") {
      let pos = tmpArray[i][1].toLowerCase().search(mark.toLowerCase());
      let len = mark.length;
      name = insertMark(tmpArray[i][1], pos, len);
    }

    tbody.insertAdjacentHTML(
      "beforeend",
      `
      <tr class="align-middle">
        
        <td class="name">${name}</td>
        <td class="price">${tmpArray[i][2]}</td>
        <td>${tmpArray[i][3]}</td>
        
        </tr>
      `
    );
  }
}

function elasticSearch() {
  val = this.value.trim().toLowerCase();
  searchResult = [];

  if (val != "") {
    for (let i = 0; i < goods.length; i++) {
      if (goods[i][1].toLowerCase().search(val) != -1) {
        searchResult.push([goods[i][0], goods[i][1], goods[i][2], goods[i][3]]);
      }
    }
  } else searchResult = goods;
  if (searchResult.length > 0) {
    updateList(searchResult, val, 0, rowOnPage);
    pagination(1, visibilityIntervalPage, Math.ceil(searchResult.length / rowOnPage));
  }
}

function insertMark(row, pos, len) {
  return row.slice(0, pos) + "<mark>" + row.slice(pos, pos + len) + "</mark>" + row.slice(pos + len);
}
// pagination;
function pagination(numActivePage, visibilityIntervalPage, pages) {
  let tpagination = document.querySelector(".pagination");
  tpagination.innerHTML = "";
  let start = numActivePage - Math.floor(visibilityIntervalPage / 2) < 0 ? 0 : numActivePage - Math.floor(visibilityIntervalPage / 2);
  let finish = start + visibilityIntervalPage;

  if (finish > pages) {
    finish = pages;
    start = finish - visibilityIntervalPage < 0 ? 0 : finish - visibilityIntervalPage + 1;
  }

  console.log("from pagination  start =" + start + " finish=" + finish + "  pages:" + pages);

  let disabled = "";
  if (start != 0) {
    tpagination.insertAdjacentHTML("beforeend", ` <li class="page-item ${disabled}"><button class="page-link">1</button></li>  `);
  }

  for (let i = start; i < finish; i++) {
    let active = i === numActivePage - 1 ? "active" : "";
    tpagination.insertAdjacentHTML(
      "beforeend",
      `
    <li class="page-item ${active}"><button class="page-link">${i + 1}</button></li>
    `
    );
  }
  if (finish != pages) {
    tpagination.insertAdjacentHTML("beforeend", ` <li class="page-item "><button class="page-link">${pages}</button></li>  `);
  }
}

//pagination handler

document.querySelector(".pagination").addEventListener(
  "click",
  function (event) {
    let selectedPage = event.target.closest(".page-item").firstElementChild.innerText;
    searchResult = searchResult.length == 0 ? goods : searchResult;
    // console.log("Selected Page=" + selectedPage);
    myFunction(searchResult, selectedPage, rowOnPage, val, visibilityIntervalPage);
  },
  true
);

function myFunction(searchResult, selectedPage, rowOnPage, val, visibilityIntervalPage) {
  rowStart = (selectedPage - 1) * rowOnPage;
  let pages = Math.ceil(searchResult.length / rowOnPage);

  updateList(searchResult, val, rowStart, rowOnPage);
  console.log("from myFunction rowStart=" + rowStart + "   searchResult=" + searchResult.length + " rowOnPage:" + rowOnPage + " pages=" + pages);

  pagination(selectedPage, visibilityIntervalPage, pages);
}
