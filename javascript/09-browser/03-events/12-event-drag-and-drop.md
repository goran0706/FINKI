# Drag and Drop Events

## Overview of HTML5 Drag and Drop API

The HTML5 Drag and Drop API enables users to click, drag, and drop elements or files within the browser interface or
between the desktop and the browser. The API relies on a specific sequence of lifecycle events paired with a data
transfer object (`DataTransfer`) to move data from a drag source to a drop target.

| Drag Source Events (Fired on dragged element)         | Drop Target Events (Fired on drop zone container)                  |
|:------------------------------------------------------|:-------------------------------------------------------------------|
| **`dragstart`**: Initiated when user starts dragging. | **`dragenter`**: Fired when dragged item enters target boundaries. |
| **`drag`**: Fired continuously while dragging.        | **`dragover`**: Fired continuously while hovering over target.     |
| **`dragend`**: Fired when drag operation concludes.   | **`dragleave`**: Fired when dragged item leaves target boundaries. |
|                                                       | **`drop`**: Fired when item is released over valid drop target.    |

## Implementing a Drag Source

To make an HTML element draggable, set the `draggable="true"` attribute and attach a `dragstart` listener to store
payload data using the `event.dataTransfer` object.

```html

<div id="source-item" draggable="true">Drag me to the target</div>
```

```javascript
const sourceItem = document.querySelector('#source-item');

sourceItem.addEventListener('dragstart', (event) => {
    // Store payload data and specify drop effect
    event.dataTransfer.setData('text/plain', event.target.id);
    event.dataTransfer.effectAllowed = 'move';

    event.target.classList.add('is-dragging');
});

sourceItem.addEventListener('dragend', (event) => {
    event.target.classList.remove('is-dragging');
});
```

## Implementing a Drop Target

By default, the browser prevents elements from acting as drop targets. To accept a drop, you **must** call
`event.preventDefault()` inside both the `dragover` and `drop` event listeners.

```html

<div id="drop-zone">Drop items here</div>
```

```javascript
const dropZone = document.querySelector('#drop-zone');

dropZone.addEventListener('dragover', (event) => {
    // REQUIRED: Prevent default to allow dropping
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
});

dropZone.addEventListener('dragenter', (event) => {
    event.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.classList.remove('drag-over');

    // Retrieve data stored during dragstart
    const dataId = event.dataTransfer.getData('text/plain');
    const draggedElement = document.getElementById(dataId);

    // Move element into drop zone
    dropZone.appendChild(draggedElement);
});
```

## Handling Desktop File Drops

The Drag and Drop API also handles files dragged from the user's desktop operating system directly into the browser
window via `event.dataTransfer.files`.

```javascript
const fileDropZone = document.querySelector('#file-upload-zone');

fileDropZone.addEventListener('dragover', (e) => e.preventDefault());

fileDropZone.addEventListener('drop', (event) => {
    event.preventDefault();

    const files = event.dataTransfer.files;
    if (files.length > 0) {
        console.log(`Dropped file: ${files[0].name} (${files[0].size} bytes)`);
        processUploadedFile(files[0]);
    }
});
```

## Use Cases

* **Kanban Board Task Cards:** Dragging task cards between status columns (e.g., Todo, In Progress, Done).
* **Desktop File Upload Zones:** Dragging and dropping documents or images from a local file explorer into a browser
  upload box.
* **Custom File Tree Sorters:** Reordering items in nested folder structures or lists via drag handles.

## Best Practices

* **Always Call `event.preventDefault()` on `dragover` and `drop`:** Failing to prevent default on `dragover` will cause
  the browser to reject the drop action entirely.
* **Set `draggable="true"` Explicitly:** Ensure elements intended for dragging have the `draggable="true"` attribute
  explicitly declared in HTML or set via JavaScript.
* **Clean Up Visual States on `dragend`:** Always remove highlight classes (`drag-over`, `is-dragging`) during `dragend`
  and `drop` events to prevent orphaned UI states if a drag is canceled.
* **Use `event.dataTransfer.files` for Desktop Drops:** Access local filesystem objects using `event.dataTransfer.files`
  when handling external files dropped from the operating system.