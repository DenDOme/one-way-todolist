const storageKey = 'notes-app';
const storageData = localStorage.getItem(storageKey);

const initialData = storageData ? JSON.parse(storageData) : {
    firstColumn: [],
    secondColumn: [],
    thirdColumn: []
};


let app = new Vue({
    el: '#app',
    data: {
        firstColumn: initialData.firstColumn,
        secondColumn: initialData.secondColumn,
        thirdColumn: initialData.thirdColumn,
        groupName: null,
        inputOne: null,
        inputTwo: null,
        inputThr: null,
        inputFor: null,
        inputFiv: null,
        important: null
    },
    watch: {
        firstColumn: {
            handler(newFirstColumn) {
                this.saveData();
            },
            deep: true
        },
        secondColumn: {
            handler(newSecondColumn) {
                this.saveData();
            },
            deep: true
        },
        thirdColumn: {
            handler(newThirdColumn) {
                this.saveData();
            },
            deep: true
        }
    },
    computed: {
        isDisabled() {
            return function (groupIndex, item) {

                return item.checked || this.isGroupLastItemDisabled[groupIndex] === item;
            };
        },
        isGroupLastItemDisabled() {
            return this.firstColumn.map(group => {
                if (this.secondColumn.length >= 5 && group.items.length > 0) {
                    const lastUncheckedItem = group.items.slice().reverse().find(item => !item.checked);
                    return lastUncheckedItem;
                }

                return null;
            });
        },
    },
    methods: {
        deleteCard(column, cardIndex) {
            if (confirm("Are you sure you want to delete this card?")) {
                if (column === 'first') {
                    this.firstColumn.splice(cardIndex, 1);
                } else if (column === 'second') {
                    this.secondColumn.splice(cardIndex, 1);
                }
            }
        },
        saveData() {
            const data = {
                firstColumn: this.firstColumn,
                secondColumn: this.secondColumn,
                thirdColumn: this.thirdColumn
            };
            localStorage.setItem(storageKey, JSON.stringify(data));
        },
        updateProgress(card) {
            const checkedCount = card.items.filter(item => item.checked).length;
            const progress = (checkedCount / card.items.length) * 100;
            card.isComplete = progress === 100;
            if (card.isComplete) {
                card.lastChecked = new Date().toLocaleString();
            }
            this.checkMoveCard();
        },
        MoveFirstColm() {
            this.firstColumn.forEach(card => {
                const progress = (card.items.filter(item => item.checked).length / card.items.length) * 100;

                const isMaxSecondColumn = this.secondColumn.length >= 5;

                if (progress >= 50 && !isMaxSecondColumn) {
                    this.secondColumn.push(card);
                    this.firstColumn.splice(this.firstColumn.indexOf(card), 1);
                    this.MoveSecondColm();
                }
                else {
                }
            });

        },
        MoveSecondColm() {
            this.secondColumn.forEach(card => {
                const progress = (card.items.filter(item => item.checked).length / card.items.length) * 100;
                if (progress === 100) {
                    card.isComplete = true;
                    card.lastChecked = new Date().toLocaleString();
                    this.thirdColumn.push(card);
                    this.secondColumn.splice(this.secondColumn.indexOf(card), 1);
                    this.MoveFirstColm();
                }
            })
        },
        checkMoveCard() {
            this.MoveFirstColm();
            this.MoveSecondColm();
            this.sortedColumns();
        },
        addCard() {
            const inputs = [this.inputOne, this.inputTwo, this.inputThr, this.inputFor, this.inputFiv];
            const validInputs = inputs.filter(input => input !== null && input.trim() !== '');
            const numItems = Math.max(3, Math.min(5, validInputs.length));

            if (this.groupName && this.important) {
                const newGroup = {
                    id: Date.now(),
                    groupName: this.groupName,
                    items: validInputs.slice(0, numItems).map(text => ({ text, checked: false })),
                    important: this.important,
                }
                if (this.firstColumn.length < 3) {
                    this.firstColumn.push(newGroup)
                    this.sortedColumns()
                }
            }
            this.groupName = null,
            this.inputOne = null,
            this.inputTwo = null,
            this.inputThr = null,
            this.inputFor = null,
            this.inputFiv = null,
            this.important = null
        },
        sortedColumns(){
            this.firstColumn.sort((a, b) => b.important - a.important);  
            this.secondColumn.sort((a, b) => b.important - a.important); 
            this.thirdColumn.sort((a, b) => b.important - a.important); 
        }
    },
})