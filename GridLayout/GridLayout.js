let Grid = (function () {
    function Grid(element, options) {
        if (!element) {
            throw new Error('NOT AVAILABLE');
            return;
        }
        this.default = {
            rows: 0,
            columns: 0,
            customClass: '',
            dataUrl: null
        }
        this.options = Object.assign(this.default, options || {});
        this.$root = element;
        this.init();
    }

    Grid.prototype.isValidArray = function (arr) {
        return Array.isArray(arr) && arr.length;
    }

    Grid.prototype.renderBody = function (isRearrage) {
        this.gridBody = document.createElement("div");
        this.gridBody.className = 'grid-body';
        if (isRearrage) {
            if (this.$root.querySelector('.grid-body')) {
                this.$root.querySelector('.grid-body').remove()
            }
        }
        if (this.isValidArray(this.options.rows)) {
            this.sortByKey(this.options.rows, true).forEach(function (rowElem, indx) {
                let row = document.createElement("div");
                row.className = "grid-row";
                row.id = "grid-row-" + indx;
                for (_k = 0; _k < rowElem.value.length; _k += 1) {
                    let cell = document.createElement("div");
                    cell.className = "grid-cell";
                    cell.textContent = rowElem.value[_k];
                    row.appendChild(cell);
                };
                this.gridBody.appendChild(row);

            }.bind(this))

            this.container.appendChild(this.gridBody);
        }
    }
    Grid.prototype.renderHeader = function () {
        this.header = document.createElement("div");
        this.header.className = 'grid-header';

        if (this.isValidArray(this.options.columns)) {
            this.sortByKey(this.options.columns).forEach(function (columnHeader) {
                let elem = document.createElement("div");
                elem.className = "header-cell";
                elem.textContent = columnHeader.value;
                this.header.appendChild(elem);
            }.bind(this));
            if (this.$root.querySelector('.grid-body')) {
                this.$root.querySelector('.grid-header').remove();
                this.container.insertBefore(this.header, this.$root.querySelector('.grid-body'));
            } else {
                this.container.appendChild(this.header);
            }
        }
        this.$root.appendChild(this.container);
    }

    Grid.prototype.sortByKey = function (obj, isRow) {
        return obj.sort(function (a, b) {
            if (isRow) {
                return a.columnKey - b.columnKey;
            } else {
                return a.key - b.key;
            }
        })
    }

    Grid.prototype.filterByKey = function (key, obj, isRow) {
        let filterArr = [];

        if (!Array.isArray(key)) {
            filterArr = obj.filter(function (itm) {
                if (isRow) {
                    return itm.columnKey === key;
                } else {
                    return itm.key === key;
                }
            });
        } else {
            filterArr = obj.filter(function (itm) {
                if (isRow) {
                    return !(itm.columnKey == key[0] || itm.columnKey == key[1]);
                } else {
                    return !(itm.key == key[0] || itm.key == key[1]);
                }
            });
        }

        return !Array.isArray(key) ? filterArr[0] : filterArr;
    }

    Grid.prototype.rearrangeColumn = function (columnKey1, columnKey2) {
        this.rearrangeGrid(columnKey1, columnKey2);
    }

    Grid.prototype.rearrangeGrid = function (columnKey1, columnKey2) {
        this.rearrangeGridData(columnKey1, columnKey2, 'column');
        this.rearrangeGridData(columnKey1, columnKey2, 'row');
    }

    Grid.prototype.rearrangeGridData = function (columnKey1, columnKey2, data) {
        let isRow = (data === 'row'),
            obj = isRow ? this.options.rows : this.options.columns,
            restArr = this.filterByKey([columnKey1, columnKey2], obj, isRow),
            f1 = this.filterByKey(columnKey1, obj, isRow),
            f2 = this.filterByKey(columnKey2, obj, isRow);
        if (isRow) {
            f1.columnKey = columnKey2;
            f2.columnKey = columnKey1;
            restArr.push(f1, f2);
            this.options.rows = restArr;
            this.renderBody(true);
        } else {
            f1.key = columnKey2;
            f2.key = columnKey1;
            restArr.push(f1, f2);
            this.options.columns = restArr;
            this.renderHeader();
        }
    }

    Grid.prototype.createContainer = function () {
        this.container = document.createElement("div");
        this.container.id = "main";
        this.container.className = "container" + ' ' + this.options.customClass;
    }

    Grid.prototype.init = function () {
        this.createContainer();
        this.renderHeader();
        this.renderBody();
    }
    return Grid;
}(window))