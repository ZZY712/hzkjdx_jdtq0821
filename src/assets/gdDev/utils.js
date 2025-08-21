export function gotoDigitalTwin(router, anchorVal) {
    anchorVal = anchorVal || 'default'
    router.push({ path: `/digitalTwin?${anchorVal}`, params: { notAuto: true } })
}
export function degToRad(d) {
    return d * Math.PI / 180.0
}
export function setRotation(rotation, model) {
    let x = degToRad(rotation.x || 0)
    let y = degToRad(rotation.y || 0)
    let z = degToRad(rotation.z || 0)
    model.rotation.set(x, y, z)
}
export function addRotation(rotation, model) {
    let x = degToRad(rotation.x || 0)
    let y = degToRad(rotation.y || 0)
    let z = degToRad(rotation.z || 0)
    model.rotateX(x)
    model.rotateY(y)
    model.rotateZ(z)
}
const EARTH_RADIUS = 6378137.0    //单位M
// 两个点之间的距离(米)
export function getFlatternDistance([lng1, lat1], [lng2, lat2]) {
    let f = degToRad((lat1 + lat2) / 2)
    let g = degToRad((lat1 - lat2) / 2)
    let l = degToRad((lng1 - lng2) / 2)

    let sg = Math.sin(g)
    let sl = Math.sin(l)
    let sf = Math.sin(f)

    let s, c, w, r, d, h1, h2
    let a = EARTH_RADIUS
    let fl = 1 / 298.257

    sg = sg * sg
    sl = sl * sl
    sf = sf * sf

    s = sg * (1 - sl) + (1 - sf) * sl
    c = (1 - sg) * (1 - sl) + sf * sl

    w = Math.atan(Math.sqrt(s / c))
    r = Math.sqrt(s * c) / w
    d = 2 * w * a
    h1 = (3 * r - 1) / 2 / c
    h2 = (3 * r + 1) / 2 / s

    return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg))
}