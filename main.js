const arrayBuku = [];
document.addEventListener("DOMContentLoaded", function () {
  const inputBuku = document.getElementById("inputBook");
  inputBuku.addEventListener("submit", function (event) {
    event.preventDefault();
    addBuku();
  });
  if (typeof storage !== undefined) {
    loadDataFromStorage();
  }
 
  const searchForm = document.getElementById("searchBook");
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    document.dispatchEvent(new Event(RENDER_SEARCH));
  });
});
 
const RENDER_SEARCH = "RENDER_SEARCH";
document.addEventListener(RENDER_SEARCH, function () {
  const searchQuery = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
    const searchedBookContainer = document.getElementById("searchedBook");
  if (searchQuery.trim() !== "") {
    
    searchedBookContainer.innerHTML = "";
    const searchResults = arrayBuku.filter(
      (buku) =>
        buku.title.toLowerCase().includes(searchQuery) ||
        buku.author.toLowerCase().includes(searchQuery)
    );
    for (const result of searchResults) {
      const resultElement = makeBuku(result);
      const statusText = document.createElement("p");
      statusText.innerText =
        result.isCompleted == true
          ? "Status: Sudah Dibaca"
          : "Status: Belum Dibaca";
      statusText.setAttribute("id", `p${result.id}`);
      statusText.classList.add("statusTitle");
      searchedBookContainer.append(resultElement, statusText);
    }
  }
  else{
    searchedBookContainer.innerHTML = "";
  }
});
 
function addBuku() {
  const judulBuku = document.getElementById("inputBookTitle").value;
  const penulisBuku = document.getElementById("inputBookAuthor").value;
  const tahunTerbitBuku = document.getElementById("inputBookYear").value;
  const checkBox = document.getElementById("inputBookIsComplete").checked;
  const idBuku = generateIdBuku();
  if (checkBox == true) {
  }
  const objekBuku = generateObjekBuku(
    idBuku,
    judulBuku,
    penulisBuku,
    parseInt(tahunTerbitBuku),
    checkBox
  );
  arrayBuku.push(objekBuku);
  document.dispatchEvent(new Event(RENDER_BUKU));
  saveData();
}
function generateIdBuku() {
  return +new Date();
}
function generateObjekBuku(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}
 
function makeBuku(bukuObject) {
  const bukuTitleText = document.createElement("h3");
  bukuTitleText.innerText = bukuObject.title;
 
  const penulisBukuText = document.createElement("p");
  penulisBukuText.innerText = `Penulis  :${bukuObject.author}`;
 
  const tahunTerbitBukuText = document.createElement("p");
  tahunTerbitBukuText.innerText = `Tahun  :${bukuObject.year}`;
 
  const bukuParagrafWrapper = document.createElement("div");
  bukuParagrafWrapper.classList.add("bookParagrafInfo");
  bukuParagrafWrapper.append(penulisBukuText, tahunTerbitBukuText);
 
  const bukuInfoWrapper = document.createElement("div");
  bukuInfoWrapper.classList.add("bookInfo")
  bukuInfoWrapper.append(bukuTitleText,bukuParagrafWrapper)
 
  const bukuWrapper = document.createElement("article");
  bukuWrapper.setAttribute("id", bukuObject.id);
  bukuWrapper.classList.add("book_item");
  bukuWrapper.append(bukuInfoWrapper);
 
  const buttonWrapper = document.createElement("div");
  buttonWrapper.classList.add("action");
 
  if (bukuObject.isCompleted == true) {
    const buttonBelumSelesai = document.createElement("button");
    const buttonHapus = document.createElement("button");
 
    buttonBelumSelesai.classList.add("green");
    buttonBelumSelesai.innerHTML = `<i class="fa-solid fa-rotate-left"></i>`;
    buttonBelumSelesai.addEventListener("click", function () {
      addBukuToInCompleted(bukuObject.id);
    });
 
    buttonHapus.classList.add("red");
    buttonHapus.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    buttonHapus.addEventListener("click", function () {
      deleteModal.showModal();
      const deleteButtonInModal = document.getElementById("delete");
      deleteButtonInModal.addEventListener("click", function () {
        removeBuku(bukuObject.id);
        deleteModal.close();
      });
 
      const backButtonInDeleteModal = document.getElementById("delete_back");
      backButtonInDeleteModal.addEventListener("click", function () {
        deleteModal.close();
      });
    });
 
    buttonWrapper.append(buttonBelumSelesai, buttonHapus);
    bukuWrapper.append(buttonWrapper);
  } else {
    const buttonSelesai = document.createElement("button");
    const buttonHapus = document.createElement("button");
 
    buttonSelesai.classList.add("green");
    buttonSelesai.innerHTML = `<i class="fa-solid fa-check"></i>`;
 
    buttonSelesai.addEventListener("click", function () {
      addBukuToCompleted(bukuObject.id);
    });
 
    buttonHapus.classList.add("red");
    buttonHapus.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
 
    buttonHapus.addEventListener("click", function () {
      deleteModal.showModal();
      const deleteButtonInModal = document.getElementById("delete");
      deleteButtonInModal.addEventListener("click", function () {
        removeBuku(bukuObject.id);
        deleteModal.close();
      });
 
      const backButtonInDeleteModal = document.getElementById("delete_back");
      backButtonInDeleteModal.addEventListener("click", function () {
        deleteModal.close();
      });
    });
 
    buttonWrapper.append(buttonSelesai, buttonHapus);
    bukuWrapper.append(buttonWrapper);
  }
 
  return bukuWrapper;
}
function addBukuToCompleted(bukuId) {
  const bukuTarget = findBukuId(bukuId);
  if (bukuTarget == null) {
    return;
  }
  bukuTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_BUKU));
  saveData();
  checkStatus(bukuId);
}
function addBukuToInCompleted(bukuId) {
  const bukuTarget = findBukuId(bukuId);
  if (bukuTarget == null) {
    return;
  }
  bukuTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_BUKU));
  saveData();
  checkStatus(bukuId);
}
function checkStatus(bukudId) {
  const bukuTarget = findBukuId(bukudId);
  const statusText = document.getElementById(`p${bukuTarget.id}`);
  if (statusText !== null && statusText !== undefined) {
    if (bukuTarget.isCompleted === true) {
      statusText.innerText = "Status  : Sudah Dibaca";
    } else {
      statusText.innerText = "Status  : Belum Dibaca";
    }
  } else {
    return
  }
 
}
function findBukuId(bukuId) {
  for (const bukuItem of arrayBuku) {
    if (bukuItem.id === bukuId) {
      return bukuItem;
    }
  }
  return null;
}
 
function removeBuku(bukuId) {
  const bukuTarget = findBukuIndex(bukuId);
  if (bukuTarget === -1) {
    return;
  }
  checkDeleteStatus(bukuId);
  arrayBuku.splice(bukuTarget, 1);
  document.dispatchEvent(new Event(RENDER_BUKU));
  saveData();
}
function checkDeleteStatus(bukuId) {
  const bukuTarget = findBukuId(bukuId);
  const bukuTargetelement = document.getElementById(`${bukuTarget.id}`);
  const statusTitleTarget = document.getElementById(`p${bukuTarget.id}`);
  if(bukuTargetelement !== null && bukuTargetelement !== undefined && statusTitleTarget!== null &&statusTitleTarget !== undefined ){
    bukuTargetelement.remove(); 
    statusTitleTarget.remove();
  }
  else{
    return null;
  }
 
}
function findBukuIndex(bukuId) {
  for (const indexBuku in arrayBuku) {
    if (arrayBuku[indexBuku].id === bukuId) {
      return indexBuku;
    }
  }
  return -1;
}
 
 
 
const STORAGE_KEY = "Daftar_Buku";
function saveData() {
  if (typeof Storage !== undefined) {
    const parsedData = JSON.stringify(arrayBuku);
    localStorage.setItem(STORAGE_KEY, parsedData);
  }
}
 
 
function loadDataFromStorage() {
  const serialData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serialData);
 
  if (data !== null) {
    for (const buku of data) {
      arrayBuku.push(buku);
    }
  }
  document.dispatchEvent(new Event(RENDER_BUKU));
}
 
 
const RENDER_BUKU = "";
document.addEventListener(RENDER_BUKU, function () {
  const rakBukuIncompleted = document.getElementById("incompleteBookshelfList");
  rakBukuIncompleted.innerHTML = "";
  const rakBukuCompleted = document.getElementById("completeBookshelfList");
  rakBukuCompleted.innerHTML = "";
  for (const buku of arrayBuku) {
    const bukuElement = makeBuku(buku);
    if (buku.isCompleted == true) {
      rakBukuCompleted.appendChild(bukuElement);
    } else {
      rakBukuIncompleted.appendChild(bukuElement);
    }
  }
});
 
 
const deleteModal = document.getElementById("delete_modal");
const closeDeleteModal = document.getElementById("close_delete_modal");
closeDeleteModal.addEventListener("click", function () {
  deleteModal.close();
});
 
 
window.addEventListener("click", function (event) {
  if (event.target === deleteModal) {
    deleteModal.close();
  }
});