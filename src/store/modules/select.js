import util from '@/api/generalFormat';

const select = {
    state: {
        selectOptions: [],
    },

    mutations: {
        setSelectOptions: (state, selectOptions) => {
            state.selectOptions = selectOptions;
        }
    },

    actions: {
        fetchSelectOptions({ commit }) {
            return util.get('/system/data/info/list')
                .then(response => {
                    const data = response.rows;
                    commit('setSelectOptions', {
                        selectOptions: data,
                    });
                })
                .catch(error => {
                    console.error('获取下拉框数据失败', error);
                });
        }
    }
};
export default select;
