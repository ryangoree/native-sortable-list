class SortRows {

    constructor(rowsSelector) {
        this.rows = document.querySelectorAll(rowsSelector);
        this.items = document.querySelectorAll(rowsSelector + ' li');
        this.placeholder = document.createElement('li');
        this.placeholder.className = 'sortable-rows-placeholder';
        let placeHolderPos = 0;
        let hoverList;
        let itemCount = 1;
        let originList;
        let movingItem;

        this.rows.forEach(row => {

            row.addEventListener('dragover', evt => {
                evt.preventDefault();
            })

            row.addEventListener('dragenter', evt => {
                if (evt.target.classList.contains('moving-item')) {
                    hoverList = evt.target.parentNode;
                } else {
                    hoverList = evt.target;
                }
                itemCount = hoverList.children.length;
                hoverList.classList.add('item-hover');
            });

            row.addEventListener('dragleave', evt => {
                hoverList.classList.remove('item-hover');
            });

            row.addEventListener('drop', evt => {
                evt.preventDefault();
                const id = evt.dataTransfer.getData('Text');
                const item = document.getElementById(id);
                hoverList.insertBefore(item, hoverList.children[placeHolderPos]);
            });

        });

        this.items.forEach(item => {

            item.addEventListener('dragstart', evt => {
                event.dataTransfer.setData('Text', evt.target.id);
                movingItem = evt.target;
                originList = movingItem.parentNode;
                movingItem.classList.add('moving-item');
                document.body.classList.add('item-moving');
            });

            item.addEventListener('dragend', evt => {
                movingItem.classList.remove('moving-item');
                document.body.classList.remove('item-moving');
                this.removeClassFromAll('item-hover');
            });

            item.addEventListener('drag', evt => {
                const left = evt.clientX - this.trueOffsetLeft(hoverList);
                const leftRatio = left/hoverList.offsetWidth;
                if (hoverList === originList) {
                    placeHolderPos = Math.round((itemCount) * leftRatio);
                    hoverList.insertBefore(movingItem, hoverList.children[placeHolderPos]);
                } else {
                    placeHolderPos = Math.round((itemCount + 1) * leftRatio);
                    hoverList.insertBefore(this.placeholder, hoverList.children[placeHolderPos]);
                }
            });

        });

    }

    trueOffsetLeft(el) {
        let left = el.offsetLeft;
        let oParent = el.offsetParent;
        while (oParent.nodeName && oParent.nodeName !== 'BODY') {
            left += oParent.offsetLeft;
            oParent = oParent.offsetParent;
        }
        return left;
    }

    removeClassFromAll(className) {
        document.querySelectorAll('.' + className).forEach(el => {
            el.classList.remove(className);
        });
    }

}