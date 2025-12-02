const msg: string = "Hello!";

alert(msg);

interface Style {
    name: string;
    file: string;
}

const styles: Style[] = [
    { name: "Styl 1", file: "/style-1.css" },
    { name: "Styl 2", file: "/Style-2.css" },
    { name: "Styl 3", file: "/style-3.css" }
];

let currentStyle: HTMLLinkElement | null = null;

function applyStyle(style: Style) {
    if (currentStyle) {
        currentStyle.remove();
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = style.file;
    document.head.appendChild(link);

    currentStyle = link;
}

const styleContainer = document.createElement("div");
document.body.prepend(styleContainer);

styles.forEach(style => {
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = style.name;
    a.style.marginRight = "10px";
    a.addEventListener("click", (e) => {
        e.preventDefault();
        applyStyle(style);
    });
    styleContainer.appendChild(a);
});
