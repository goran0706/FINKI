const body = document.body;

const backdrop = document.createElement("div");
backdrop.setAttribute("id", "backdrop");
backdrop.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
backdrop.style.position = "fixed";
backdrop.style.top = "0";
backdrop.style.left = "0";
backdrop.style.width = "100%";
backdrop.style.height = "100%";

const modal = document.createElement("div");
modal.style.backgroundColor = "#fff";
modal.style.borderRadius = "6px";
modal.style.margin = "10% auto";
modal.style.maxWidth = "400px";
modal.style.position = "relative";
modal.style.text = "center";
modal.style.width = "100%";
modal.style.display = "flex";
modal.style.flexDirection = "column";
modal.style.alignItems = "center";
modal.style.justifyContent = "space-between";
modal.style.overflow = "hidden";

const modalHeader = document.createElement("div");
modalHeader.style.padding = "1rem";
modalHeader.style.display = "flex";
modalHeader.style.alignItems = "center";
modalHeader.style.justifyContent = "flex-end";
modalHeader.style.width = "100%";
modalHeader.style.backgroundColor = "whitesmoke";

const modalContent = document.createElement("div");
modalContent.style.padding = "1rem";
modalContent.style.flex = "1";
modalContent.style.display = "flex";
modalContent.style.alignItems = "center";
modalContent.style.justifyContent = "center";
modalContent.textContent = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod
mollitia corrupti error molestias, dolores, sequi eius dolor aliquid
animi cumque, omnis eos non voluptatibus reprehenderit aliquam
veniam unde molestiae dignissimos.`;

const modalFooter = document.createElement("div");
modalFooter.style.padding = "1rem";
modalFooter.style.display = "flex";
modalFooter.style.alignItems = "center";
modalFooter.style.justifyContent = "flex-end";
modalFooter.style.width = "100%";
modalFooter.style.backgroundColor = "whitesmoke";

const buttonX = document.createElement("button");
buttonX.style.padding = "6px";
buttonX.style.color = "#fff";
buttonX.style.backgroundColor = "crimson";
buttonX.style.border = "none";
buttonX.style.borderRadius = "6px";
buttonX.style.display = "block";
buttonX.style.cursor = "pointer";
buttonX.textContent = "X";

const buttonOpen = document.createElement("button");
buttonOpen.style.padding = "8px 16px";
buttonOpen.style.margin = "2rem auto";
buttonOpen.style.display = "block";
buttonOpen.style.cursor = "pointer";
buttonOpen.textContent = "Open Modal";

const buttonClose = document.createElement("button");
buttonClose.style.padding = "8px 16px";
buttonClose.style.color = "#fff";
buttonClose.style.backgroundColor = "crimson";
buttonClose.style.border = "none";
buttonClose.style.borderRadius = "6px";
buttonClose.style.display = "block";
buttonClose.style.cursor = "pointer";
buttonClose.textContent = "Close";

body.appendChild(buttonOpen);
body.appendChild(backdrop);
backdrop.appendChild(modal);
modal.append(modalHeader, modalContent, modalFooter);
modalHeader.appendChild(buttonX);
modalFooter.appendChild(buttonClose);

backdrop.addEventListener("click", (e) => {
  if (e.target.id === "backdrop") backdrop.style.display = "none";
});

buttonX.addEventListener("click", () => (backdrop.style.display = "none"));
buttonClose.addEventListener("click", () => (backdrop.style.display = "none"));
buttonOpen.addEventListener("click", () => (backdrop.style.display = "block"));
