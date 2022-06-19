const modal = document.getElementById("modal");
const modalShow = document.getElementById("show-modal");
const modalClose = document.getElementById("close-modal");
const bookmarkForm = document.getElementById("bookmark-form");
const websiteNameEl = document.getElementById("website-name");
const websiteUrlEl = document.getElementById("website-url");
const bookmarksContainer = document.getElementById("bookmarks-container");

let bookmarks = {};

// Show modal, Focus on first input
function showModal() {
  modal.classList.add("show-modal");
  websiteNameEl.focus();
}

// Modal Event Listeners
modalShow.addEventListener("click", showModal);
modalClose.addEventListener("click", () => {
  modal.classList.remove("show-modal");
});
window.addEventListener("click", (e) =>
  e.target === modal ? modal.classList.remove("show-modal") : false
);

// Validate Form

function validate(nameValue, urlValue) {
  const expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if (!nameValue || !urlValue) {
    alert("Please submit values for both fields");
    return false;
  }
  if (urlValue.match(regex)) {
    alert("Successful match");
  }
  if (!urlValue.match(regex)) {
    alert("Please provide a valid URL");
    return false;
  }
  //   valid
  return true;
}

// Build Bookmarks DOM
function buildBookmarks() {
  // Remove all bookmarks from DOM
  bookmarksContainer.textContent = "";
  // Build Items
  Object.keys(bookmarks).forEach((id) => {
    const { name, url } = bookmark[id];
    // Item
    const item = document.createElement("div");
    item.classList.add("item");
    // Close Icon
    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fas", "fa-times");
    closeIcon.setAttribute("title", "Delete Bookmark");
    closeIcon.setAttribute("onclick", `deleteBookmark('${url}')`);
    // Favicon / link Container
    const linkInfo = document.createElement("div");
    linkInfo.classList.add("name");
    // Favicon
    const favicon = document.createElement("img");
    favicon.setAttribute(
      "src",
      `https://www.google.com/s2/favicons?domain=${url}`
    );
    favicon.setAttribute("alt", "Favicon");
    // Link
    const link = document.createElement("a");
    link.setAttribute("href", `${url}`);
    link.setAttribute("target", "_blank");
    link.textContent = name;
    // Append to bookmarks container
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  });
}

// Fetch our Bookmarks from Local Storage
function fetchBookmarks() {
  // Get bookmarks from local storage, if available
  if (localStorage.getItem("bookmarks")) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  } else {
    // Create a new array if no bookmarks are available in local storage
    const id = `www.google.com`;
    bookmarks[id] = {
      name: "Google",
      url: "https://www.google.com",
    };
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }
  //   Build bookmarks
  buildBookmarks();
}

// Delete Bookmark
function deleteBookmark(id) {
  // Loop through bookmarks array
  if (bookmark[id]) {
    delete bookmarks[id];
  }
  //   Update bookmarks array in local storage, re-populate DOM
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
}

// Handle Data from Form
function storeBookmark(e) {
  e.preventDefault();
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;
  if (!urlValue.includes("https://") && !urlValue.includes("http://")) {
    urlValue = `https://${urlValue}`;
  }
  if (!validate(nameValue, urlValue)) {
    return false;
  }
  const bookmark = {
    name: nameValue,
    url: urlValue,
  };
  bookmarks.push(bookmark);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.rest();
  websiteNameEl.focus();
}

// Event Listener
bookmarkForm.addEventListener("submit", storeBookmark);
// On Load, fetch bookmarks
fetchBookmarks();
