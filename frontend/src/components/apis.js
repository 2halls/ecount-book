const API_END_POINT = 'http://172.29.12.18:3001'

const formattedMonth = (month) => {
    return String(month).padStart(2, '0')
}

/**
 * GET 요청: Accounts 데이터 가져오기
 * @param {number} year
 * @param {number} month
 * @param {string} [sort] - 선택적 파라미터
 * @param {string} [order] - 선택적 파라미터
 */
const getAccounts = async (year, month) => {
    try {
        const queryParams = new URLSearchParams({ year, month: formattedMonth(month) }).toString();

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

/**
 * POST 요청: 새 Account 생성
 * @param {object} accountData
 */
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

/**
 * GET 요청: 월별 손익계산서 가져오기
 * @param {number} year
 * @param {number} month
 */
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

module.exports = {
    getAccounts,
    createAccount,
    getStatements
};