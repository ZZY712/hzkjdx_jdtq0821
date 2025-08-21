export function getSelectDatas(data, typeName) {
    let levelData = [];
    let provinceData = {};
    let townData = {};
    let regionData = {};
    let stateData = {};
    let selectData = {}
    data.forEach(item => {
        if (item.dataType === typeName) {
            // 处理 levelData
            if (!levelData.includes(item.acType)) {
                levelData.push(item.acType);
            }
            // 处理 stateData
            if (!stateData[item.acType]) {
                stateData[item.acType] = [];
            }
            if (!stateData[item.acType].includes(item.dataType)) {
                stateData[item.acType].push(item.dataType);
            }
            let provinceName = item.acType + '-' + item.dataType;
            let townName = item.acType + '-' + item.dataType + '-' + item.province;
            let regionName = item.acType + '-' + item.dataType + '-' + item.province + '-' + item.town;

            // 处理 provinceData
            if (!provinceData[provinceName]) {
                provinceData[provinceName] = [];
            }
            if (!provinceData[provinceName].includes(item.province)) {
                provinceData[provinceName].push(item.province);
            }

            // 处理 townData
            if (!townData[townName]) {
                townData[townName] = [];
            }
            if (!townData[townName].includes(item.town)) {
                townData[townName].push(item.town);
            }

            // 处理 regionData
            if (!regionData[regionName]) {
                regionData[regionName] = [];
            }
            if (!regionData[regionName].includes(item.name)) {
                regionData[regionName].push(item.name);
            }
        }
    });

    selectData = {
        levelData,
        regionData,
        provinceData,
        townData,
        stateData
    };
    return selectData;
}