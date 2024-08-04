const API_END_POINT = 'http://172.29.12.18:3001';

const categoryMap = {
  expense: {
    food: '식비',
    travel: '여행,여가',
    transportation: '교통비',
    housing: '주거,통신',
    education: '교육비',
    tax: '증여,세금,이자',
  },
  revenue: {
    salary: '월급',
    pension: '퇴직연금(회사몫)',
  },
};

const formattedMonth = (month) => {
  return String(month).padStart(2, '0');
};

const getAccounts = async (year, month, sort = 'date', order = 'asc') => {
  try {
    const queryParams = new URLSearchParams({
      year,
      month: formattedMonth(month),
      sort,
      order,
    }).toString();

    const res = await fetch(`${API_END_POINT}/accounts?${queryParams}`);

    if (!res.ok) {
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

    if (!res.ok) {
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

    if (!res.ok) {
      throw new Error('서버에서 데이터를 받아오지 못하였습니다.');
    }

    return await res.json();
  } catch (error) {
    console.error(`에러가 발생하였습니다: ${error.message}`);
    throw error;
  }
};

const renderAccounts = (accounts) => {
  const accountsBody = document.getElementById('accounts-body');
  const emptyMessage = document.getElementById('empty-message');
  accountsBody.innerHTML = ''; // 기존 내용을 지우기

  if (accounts.length === 0) {
    emptyMessage.style.display = 'block';
    document.getElementById('total-count').textContent = '(0)';
    document.getElementById('total-amount').textContent = '0 원';
    document.getElementById('revenue-count').textContent = '(0)';
    document.getElementById('revenue-amount').textContent = '0 원';
    document.getElementById('expense-count').textContent = '(0)';
    document.getElementById('expense-amount').textContent = '0 원';
    return;
  } else {
    emptyMessage.style.display = 'none';
  }

  const totalCount = accounts.length;
  const revenueCount = accounts.filter(
    (account) => account.transactionType === 'revenue'
  ).length;
  const expenseCount = accounts.filter(
    (account) => account.transactionType === 'expense'
  ).length;

  const totalRevenue = accounts
    .filter((account) => account.transactionType === 'revenue')
    .reduce((sum, account) => sum + account.amount, 0);

  const totalExpense = accounts
    .filter((account) => account.transactionType === 'expense')
    .reduce((sum, account) => sum + account.amount, 0);

  const netTotal = totalRevenue - totalExpense;

  document.getElementById('total-count').textContent = `(${totalCount})`;
  document.getElementById('revenue-count').textContent = `(${revenueCount})`;
  document.getElementById('expense-count').textContent = `(${expenseCount})`;

  document.getElementById(
    'total-amount'
  ).textContent = `${netTotal.toLocaleString()} 원`;
  document.getElementById('total-amount').className =
    netTotal >= 0
      ? 'total-amount revenue-amount'
      : 'total-amount expense-amount';

  document.getElementById(
    'revenue-amount'
  ).textContent = `${totalRevenue.toLocaleString()} 원`;
  document.getElementById(
    'expense-amount'
  ).textContent = `${totalExpense.toLocaleString()} 원`;

  accounts.forEach((account) => {
    const category =
      categoryMap[account.transactionType][account.category] ||
      account.category;
    const formattedAmount = `${account.amount.toLocaleString()} 원`;
    const slicedContent =
      account.content.length > 20
        ? `${account.content.slice(0, 20)}...`
        : account.content;
    const amountClass =
      account.transactionType === 'revenue'
        ? 'revenue-amount'
        : 'expense-amount';

    const row = document.createElement('tr');

    row.innerHTML = `
        <td><input type="checkbox" /></td>
        <td>${account.date}</td>
        <td>${account.bank}</td>
        <td>${category}</td>
        <td class="content">${slicedContent}</td>
        <td class="amount ${amountClass}">${formattedAmount}</td>
      `;

    accountsBody.appendChild(row);
  });
};

const fetchAndDisplayAccounts = async (
  year,
  month,
  sort = 'date',
  order = 'asc'
) => {
  try {
    const accounts = await getAccounts(year, month, sort, order);
    renderAccounts(accounts.data);
  } catch (error) {
    console.error('데이터 로드 실패:', error);
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  let currentYear = 2017;
  let currentMonth = 11;
  let currentSort = 'date';
  let currentOrder = 'asc';

  const prevMonthBtn = document.getElementById('prev-month-btn');
  const nextMonthBtn = document.getElementById('next-month-btn');
  const currentMonthPicker = document.getElementById('current-month-picker');
  const selectAllCheckbox = document.getElementById('select-all');
  const sortDateHeader = document.getElementById('sort-date');

  // 초기화 시 기본값 설정
  currentMonthPicker.value = `${currentYear}-${String(currentMonth).padStart(
    2,
    '0'
  )}`;

  const updateMonthDisplay = () => {
    currentMonthPicker.value = `${currentYear}-${String(currentMonth).padStart(
      2,
      '0'
    )}`;
  };

  const updateDataAndDisplay = () => {
    updateMonthDisplay();
    fetchAndDisplayAccounts(currentYear, currentMonth);
  };

  // 초기화 시 기본값 설정
  updateMonthDisplay();
  fetchAndDisplayAccounts(currentYear, currentMonth, currentSort, currentOrder);

  prevMonthBtn.addEventListener('click', () => {
    currentMonth -= 1;
    if (currentMonth < 1) {
      currentMonth = 12;
      currentYear -= 1;
    }
    updateDataAndDisplay();
  });

  nextMonthBtn.addEventListener('click', () => {
    currentMonth += 1;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear += 1;
    }
    updateDataAndDisplay();
  });

  currentMonthPicker.addEventListener('change', (e) => {
    const [year, month] = e.target.value.split('-');
    currentYear = parseInt(year, 10);
    currentMonth = parseInt(month, 10);
    updateDataAndDisplay();
  });

  selectAllCheckbox.addEventListener('change', (e) => {
    const checkboxes = document.querySelectorAll(
      '#accounts-body input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = e.target.checked;
    });
  });

  sortDateHeader.addEventListener('click', () => {
    currentOrder = currentOrder === 'asc' ? 'desc' : 'asc';
    fetchAndDisplayAccounts(
      currentYear,
      currentMonth,
      currentSort,
      currentOrder
    );
  });

  //   Offcanvas
  const addTransactionBtn = document.getElementById('add-transaction-btn');
  const offcanvas = document.getElementById('offcanvas');
  const closeOffcanvasBtn = document.getElementById('close-offcanvas-btn');
  const transactionForm = document.getElementById('transaction-form');
  const revenueRadio = document.getElementById('revenue');
  const expenseRadio = document.getElementById('expense');
  const categoryContainer = document.getElementById('category-container');

  document
    .getElementById('close-offcanvas-btn')
    .addEventListener('click', function () {
      document.getElementById('offcanvas').classList.remove('show');
    });

  const toggleOffcanvas = () => {
    offcanvas.classList.toggle('show');
  };

  addTransactionBtn.addEventListener('click', toggleOffcanvas);
  closeOffcanvasBtn.addEventListener('click', function () {
    document.getElementById('offcanvas').classList.remove('show');
  });

  transactionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const transactionType = document.querySelector(
      'input[name="transactionType"]:checked'
    ).value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const bank = document.getElementById('bank').value;
    const category = document.getElementById(
      transactionType === 'revenue' ? 'revenue-category' : 'expense-category'
    ).value;
    const amount = parseFloat(document.getElementById('amount').value);
    const content = document.getElementById('content').value;

    try {
      const res = await createAccount({
        transactionType,
        date,
        time,
        bank,
        category,
        amount,
        content,
      });

      if (res.status) {
        offcanvas.classList.remove('show');
        transactionForm.reset(); // 폼 초기화
        alert('등록 되었습니다.');

        fetchAndDisplayAccounts(
          currentYear,
          currentMonth,
          currentSort,
          currentOrder
        );
      }
    } catch (error) {
      console.error(`에러가 발생하였습니다: ${error.message}`);
    }
  });

  revenueRadio.addEventListener('change', () => {
    categoryContainer.innerHTML = `
            <label for="revenue-category">분류 *</label>
            <select id="revenue-category" required>
                <option value="" disabled selected>선택</option>
                <option value="salary">급여</option>
                <option value="pension">퇴직연금(회사몫)</option>
            </select>
        `;
  });

  expenseRadio.addEventListener('change', () => {
    categoryContainer.innerHTML = `
            <label for="expense-category">분류 *</label>
            <select id="expense-category" required>
                <option value="" disabled selected>선택</option>
                <option value="food">식비</option>
                <option value="travel">여행,여가</option>
                <option value="transportation">교통비</option>
                <option value="housing">주거,통신</option>
                <option value="education">교육비</option>
                <option value="tax">증여,세금,이자</option>
            </select>
        `;
  });

  //   월별 손익계산서 Modal
  document
    .getElementById('current-month-btn')
    .addEventListener('click', async () => {
      try {
        const statements = await getStatements(
          currentYear,
          formattedMonth(currentMonth)
        );

        console.log('@@@', { statements });
        renderRevenueStatement({
          year: currentYear,
          month: formattedMonth(currentMonth),
          statementData: statements.data,
        });
        toggleModal();
      } catch (error) {
        console.error('손익계산서 조회 중 에러 발생:', error);
      }
    });

  const renderRevenueStatement = ({ year, month, statementData }) => {
    const { expense, totalExpense, revenue, totalRevenue } = statementData;
    document.getElementById(
      'statement-date'
    ).textContent = `기간: ${year}-${month
      .toString()
      .padStart(2, '0')}-01 ~ ${year}-${month
      .toString()
      .padStart(2, '0')}-${new Date(year, month, 0).getDate()}`;

    const expensesList = document.getElementById('expenses-list');
    const revenueList = document.getElementById('revenue-list');
    expensesList.innerHTML = '';
    revenueList.innerHTML = '';

    Object.entries(expense).forEach(([category, amount]) => {
      const li = document.createElement('li');
      const categorySpan = document.createElement('span');
      const amountSpan = document.createElement('span');

      categorySpan.textContent = categoryMap['expense'][category];
      amountSpan.textContent = `${amount.toLocaleString()} 원`;

      li.appendChild(categorySpan);
      li.appendChild(amountSpan);

      expensesList.appendChild(li);
    });

    const totalExpenseLi = document.createElement('li');
    totalExpenseLi.style.color = 'red';
    totalExpenseLi.innerHTML = `<span>총 지출</span><span>${totalExpense.toLocaleString()} 원</span>`;
    expensesList.appendChild(totalExpenseLi);

    Object.entries(revenue).forEach(([category, amount]) => {
      const li = document.createElement('li');
      const categorySpan = document.createElement('span');
      const amountSpan = document.createElement('span');

      categorySpan.textContent = categoryMap['revenue'][category];
      amountSpan.textContent = `${amount.toLocaleString()} 원`;

      li.appendChild(categorySpan);
      li.appendChild(amountSpan);

      revenueList.appendChild(li);
    });

    const totalRevenueLi = document.createElement('li');
    totalRevenueLi.style.color = 'blue';
    totalRevenueLi.innerHTML = `<span>총 수입</span><span>${totalRevenue.toLocaleString()} 원</span>`;
    revenueList.appendChild(totalRevenueLi);

    const netRevenue = totalRevenue - totalExpense;
    document.getElementById(
      'net-revenue'
    ).textContent = `총단기 순이익: ${netRevenue.toLocaleString()} 원`;
  };

  const toggleModal = () => {
    const modal = document.getElementById('revenue-statement-modal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
  };

  document
    .getElementById('close-modal-btn')
    .addEventListener('click', toggleModal);
});
