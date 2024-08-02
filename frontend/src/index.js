// const API_END_POINT = 'http://172.29.12.18:3001' // 황현님
const API_END_POINT = 'http://localhost:3001'

const formattedMonth = (month) => {
    return String(month).padStart(2, '0')
}

const getAccounts = async (year, month) => {
    try {
        const queryParams = new URLSearchParams({ year, month: formattedMonth(month), sort: 'date', order: 'asc' }).toString();

        console.log({ queryParams })
        const res = await fetch(`${API_END_POINT}/accounts?${queryParams}`);
        console.log({ res })
        if (!res.status) {
            throw new Error('서버에서 데이터를 받아오지 못하였습니다.');
        }

        return await res.json();
    } catch (error) {
        console.error(`에러가 발생하였습니다: ${error.message}`);
        throw error;
    }
};


const createAccount = async (accountData) => {
    try {
        const res = await fetch(`${API_END_POINT}/accounts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(accountData),
        });

        if (!res.status) {
            throw new Error('서버에 데이터를 저장하지 못하였습니다.');
        }

        return await res.json();
    } catch (error) {
        console.error(`에러가 발생하였습니다: ${error.message}`);
        throw error;
    }
};


const getStatements = async (year, month) => {
    try {
        const queryParams = new URLSearchParams({ year, month }).toString();
        const res = await fetch(`${API_END_POINT}/statements?${queryParams}`);

        if (!res.status) {
            throw new Error('서버에서 데이터를 받아오지 못하였습니다.');
        }

        return await res.json();
    } catch (error) {
        console.error(`에러가 발생하였습니다: ${error.message}`);
        throw error;
    }
};


document.addEventListener('DOMContentLoaded', async () => {
    let currentYear = 2017;
    let currentMonth = 11;

    const prevMonthBtn = document.getElementById('prev-month-btn');
    const nextMonthBtn = document.getElementById('next-month-btn');
    const currentMonthPicker = document.getElementById('current-month-picker');
    const totalAmountDisplay = document.getElementById('total-amount');
    const totalIncomeDisplay = document.getElementById('total-income');
    const totalExpenseDisplay = document.getElementById('total-expense');
    const totalCountDisplay = document.getElementById('total-count');
    const incomeCountDisplay = document.getElementById('income-count');
    const expenseCountDisplay = document.getElementById('expense-count');
    const accountsBody = document.getElementById('accounts-body');
    const addTransactionBtn = document.getElementById('add-transaction-btn');
    const offcanvas = document.getElementById('offcanvas');
    const closeOffcanvasBtn = document.getElementById('close-offcanvas-btn');
    const transactionForm = document.getElementById('transaction-form');
    const incomeRadio = document.getElementById('income');
    const expenseRadio = document.getElementById('expense');
    const categoryContainer = document.getElementById('category-container');

    // 초기화 시 기본값 설정
    currentMonthPicker.value = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;

    const updateMonthDisplay = () => {
        currentMonthPicker.value = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    };

    const fetchAndDisplayAccounts = async () => {
        try {
            const accounts = await getAccounts(currentYear, currentMonth);
            accountsBody.innerHTML = '';
            let totalAmount = 0;
            let totalIncome = 0;
            let totalExpense = 0;
            let totalCount = 0;
            let incomeCount = 0;
            let expenseCount = 0;

            accounts ?? accounts.forEach(account => {
                const row = document.createElement('tr');

                const checkboxCell = document.createElement('td');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkboxCell.appendChild(checkbox);
                row.appendChild(checkboxCell);

                const dateCell = document.createElement('td');
                dateCell.textContent = account.date;
                row.appendChild(dateCell);

                const assetCell = document.createElement('td');
                assetCell.textContent = account.bank;
                row.appendChild(assetCell);

                const categoryCell = document.createElement('td');
                categoryCell.textContent = account.category;
                row.appendChild(categoryCell);

                const descriptionCell = document.createElement('td');
                descriptionCell.textContent = account.content;
                row.appendChild(descriptionCell);

                const amountCell = document.createElement('td');
                amountCell.textContent = account.amount;
                row.appendChild(amountCell);

                accountsBody.appendChild(row);

                totalAmount += account.amount;
                totalCount++;
                if (account.transactionType === 'income') {
                    totalIncome += account.amount;
                    incomeCount++;
                } else if (account.transactionType === 'expense') {
                    totalExpense += account.amount;
                    expenseCount++;
                }
            });

            totalAmountDisplay.textContent = totalAmount;
            totalIncomeDisplay.textContent = totalIncome;
            totalExpenseDisplay.textContent = totalExpense;
            totalCountDisplay.textContent = `(${totalCount})`;
            incomeCountDisplay.textContent = `(${incomeCount})`;
            expenseCountDisplay.textContent = `(${expenseCount})`;
        } catch (error) {
            console.error(`에러가 발생하였습니다: ${error.message}`);
        }
    };

    const toggleOffcanvas = () => {
        offcanvas.classList.toggle('show');
    };

    addTransactionBtn.addEventListener('click', toggleOffcanvas);
    closeOffcanvasBtn.addEventListener('click', toggleOffcanvas);

    transactionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const transactionType = document.querySelector('input[name="transactionType"]:checked').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const bank = document.getElementById('bank').value;
        const category = document.getElementById(transactionType === 'income' ? 'revenue-category' : 'expense-category').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const content = document.getElementById('content').value;

        try {
            await createAccount({ transactionType, date, time, bank, category, amount, content });
            toggleOffcanvas();
            fetchAndDisplayAccounts();
        } catch (error) {
            console.error(`에러가 발생하였습니다: ${error.message}`);
        }
    });

    incomeRadio.addEventListener('change', () => {
        categoryContainer.innerHTML = `
            <label for="revenue-category">분류:</label>
            <select id="revenue-category" required>
                <option value="" disabled selected>선택</option>
                <option value="salary">급여</option>
                <option value="pension">퇴직연금(회사몫)</option>
            </select>
        `;
    });

    expenseRadio.addEventListener('change', () => {
        categoryContainer.innerHTML = `
            <label for="expense-category">분류:</label>
            <select id="expense-category" required>
                <option value="food">식비</option>
                <option value="travel">여행,여가</option>
                <option value="transportation">교통비</option>
                <option value="housing">주거,통신</option>
                <option value="education">교육비</option>
                <option value="tax">증여,세금,이자</option>
            </select>
        `;
    });

    prevMonthBtn.addEventListener('click', () => {
        currentMonth -= 1;
        if (currentMonth < 1) {
            currentMonth = 12;
            currentYear -= 1;
        }
        updateMonthDisplay();
        fetchAndDisplayAccounts();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth += 1;
        if (currentMonth > 12) {
            currentMonth = 1;
            currentYear += 1;
        }
        updateMonthDisplay();
        fetchAndDisplayAccounts();
    });

    currentMonthPicker.addEventListener('change', (e) => {
        const [year, month] = e.target.value.split('-');
        currentYear = parseInt(year, 10);
        currentMonth = parseInt(month, 10);
        fetchAndDisplayAccounts();
    });

    // 초기 로드 시 기본 값으로 가계부 내역 불러오기
    fetchAndDisplayAccounts();
});

// document.addEventListener('DOMContentLoaded', async () => {
//     let currentYear = 2017 // new Date().getFullYear();
//     let currentMonth = 11 // new Date().getMonth() + 1;

//     const prevMonthBtn = document.getElementById('prev-month-btn');
//     const nextMonthBtn = document.getElementById('next-month-btn');
//     const currentMonthPicker = document.getElementById('current-month-picker');
//     const totalAmountDisplay = document.getElementById('total-amount');
//     const totalIncomeDisplay = document.getElementById('total-income');
//     const totalExpenseDisplay = document.getElementById('total-expense');
//     const totalCountDisplay = document.getElementById('total-count');
//     const incomeCountDisplay = document.getElementById('income-count');
//     const expenseCountDisplay = document.getElementById('expense-count');
//     const accountsBody = document.getElementById('accounts-body');
//     const addTransactionBtn = document.getElementById('add-transaction-btn');
//     const offcanvas = document.getElementById('offcanvas');
//     const closeOffcanvasBtn = document.getElementById('close-offcanvas-btn');
//     const transactionForm = document.getElementById('transaction-form');
//     const incomeRadio = document.getElementById('income');
//     const expenseRadio = document.getElementById('expense');
//     const categoryContainer = document.getElementById('category-container');

//     currentMonthPicker.value = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;

//     const updateMonthDisplay = () => {
//         currentMonthPicker.value = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
//     };

//     const fetchAndDisplayAccounts = async () => {
//         try {
//             const accounts = await getAccounts(currentYear, currentMonth);
//             accountsBody.innerHTML = '';
//             let totalAmount = 0;
//             let totalIncome = 0;
//             let totalExpense = 0;
//             let totalCount = 0;
//             let incomeCount = 0;
//             let expenseCount = 0;

//             accounts ?? accounts.forEach(account => {
//                 const row = document.createElement('tr');

//                 const checkboxCell = document.createElement('td');
//                 const checkbox = document.createElement('input');
//                 checkbox.type = 'checkbox';
//                 checkboxCell.appendChild(checkbox);
//                 row.appendChild(checkboxCell);

//                 const dateCell = document.createElement('td');
//                 dateCell.textContent = account.date;
//                 row.appendChild(dateCell);

//                 const assetCell = document.createElement('td');
//                 assetCell.textContent = account.bank;
//                 row.appendChild(assetCell);

//                 const categoryCell = document.createElement('td');
//                 categoryCell.textContent = account.category;
//                 row.appendChild(categoryCell);

//                 const descriptionCell = document.createElement('td');
//                 descriptionCell.textContent = account.content;
//                 row.appendChild(descriptionCell);

//                 const amountCell = document.createElement('td');
//                 amountCell.textContent = account.amount;
//                 row.appendChild(amountCell);

//                 accountsBody.appendChild(row);

//                 totalAmount += account.amount;
//                 totalCount++;
//                 if (account.transactionType === 'income') {
//                     totalIncome += account.amount;
//                     incomeCount++;
//                 } else if (account.transactionType === 'expense') {
//                     totalExpense += account.amount;
//                     expenseCount++;
//                 }
//             });

//             totalAmountDisplay.textContent = totalAmount;
//             totalIncomeDisplay.textContent = totalIncome;
//             totalExpenseDisplay.textContent = totalExpense;
//             totalCountDisplay.textContent = `(${totalCount})`;
//             incomeCountDisplay.textContent = `(${incomeCount})`;
//             expenseCountDisplay.textContent = `(${expenseCount})`;
//         } catch (error) {
//             console.error(`에러가 발생하였습니다: ${error.message}`);
//         }
//     };

//     const toggleOffcanvas = () => {
//         offcanvas.classList.toggle('show');
//     };

//     addTransactionBtn.addEventListener('click', toggleOffcanvas);
//     closeOffcanvasBtn.addEventListener('click', toggleOffcanvas);

//     transactionForm.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         const transactionType = document.querySelector('input[name="transactionType"]:checked').value;
//         const date = document.getElementById('date').value;
//         const time = document.getElementById('time').value;
//         const bank = document.getElementById('bank').value;
//         const category = document.getElementById(b === 'income' ? 'revenue-category' : 'expense-category').value;
//         const amount = parseFloat(document.getElementById('amount').value);
//         const content = document.getElementById('content').value;

//         try {
//             await createAccount({ transactionType, date, time, bank, category, amount, content });
//             console.log({ transactionType, date, time, bank, category, amount, content })
//             toggleOffcanvas();
//             fetchAndDisplayAccounts();
//         } catch (error) {
//             console.error(`에러가 발생하였습니다: ${error.message}`);
//         }
//     });

//     incomeRadio.addEventListener('change', () => {
//         categoryContainer.innerHTML = `
//             <label for="revenue-category">분류:</label>
//             <select id="revenue-category" required>
//                 <option value="" disabled selected>선택</option>
//                 <option value="salary">급여</option>
//                 <option value="pension">퇴직연금(회사몫)</option>
//             </select>
//         `;
//     });

//     expenseRadio.addEventListener('change', () => {
//         categoryContainer.innerHTML = `
//             <label for="expense-category">분류:</label>
//             <select id="expense-category" required>
//                 <option value="" disabled selected>선택</option>
//                 <option value="food">식비</option>
//                 <option value="travel">여행,여가</option>
//                 <option value="transportation">교통비</option>
//                 <option value="housing">주거,통신</option>
//                 <option value="education">교육비</option>
//                 <option value="tax">증여,세금,이자</option>
//             </select>
//         `;
//     });

//     prevMonthBtn.addEventListener('click', () => {
//         currentMonth -= 1;
//         if (currentMonth < 1) {
//             currentMonth = 12;
//             currentYear -= 1;
//         }
//         updateMonthDisplay();
//         fetchAndDisplayAccounts();
//     });

//     nextMonthBtn.addEventListener('click', () => {
//         currentMonth += 1;
//         if (currentMonth > 12) {
//             currentMonth = 1;
//             currentYear += 1;
//         }
//         updateMonthDisplay();
//         fetchAndDisplayAccounts();
//     });

//     currentMonthPicker.addEventListener('change', (e) => {
//         const [year, month] = e.target.value.split('-');
//         currentYear = parseInt(year, 10);
//         currentMonth = parseInt(month, 10);
//         fetchAndDisplayAccounts();
//     });

//     fetchAndDisplayAccounts();
// });
