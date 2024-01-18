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
    },
    watch: {
        firstColumn: {
            handler(newFirstColumn) {
                this.saveData();
                this.checkBlockColumn();
            },
            deep: true
        },
        secondColumn: {
            handler(newSecondColumn) {
                this.saveData();
                this.checkBlockColumn();
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
    methods: {
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
        checkBlockColumn() {
            const inProgressCount = this.firstColumn.filter(card => {
                const progress = (card.items.filter(item => item.checked).length / card.items.length) * 100;
                return progress > 50;
            }).length;

            const isMaxSecondColumn = this.secondColumn.length >= 5;

            if (inProgressCount > 0 && isMaxSecondColumn) {
                this.firstColumn.forEach(card => {
                    card.items.forEach(item => {
                        item.checked = false;
                    });
                });
            }
        },
        checkMoveCard() {
            this.firstColumn.forEach(card => {
                const progress = (card.items.filter(item => item.checked).length / card.items.length) * 100;
                if (progress >= 50) {
                    this.secondColumn.push(card);
                    this.firstColumn.splice(this.firstColumn.indexOf(card), 1);
                }
            });
            this.secondColumn.forEach(card => {
                const progress = (card.items.filter(item => item.checked).length / card.items.length) * 100;
                if (progress === 100) {
                    card.isComplete = true;
                    card.lastChecked = new Date().toLocaleString();
                    this.thirdColumn.push(card);
                    this.secondColumn.splice(this.secondColumn.indexOf(card), 1);
                }
            })
        },
        addCard() {
            const newGroup = {
                id: Date.now(),
                groupName: this.groupName,
                items: [
                    { text: this.inputOne, checked: false },
                    { text: this.inputTwo, checked: false },
                    { text: this.inputThr, checked: false },
                ]
            }
            this.firstColumn.push(newGroup),
                this.groupName = null,
                this.inputOne = null,
                this.inputTwo = null,
                this.inputThr = null
        }
    },
    mounted() {
        this.checkBlockColumn();
    }
})