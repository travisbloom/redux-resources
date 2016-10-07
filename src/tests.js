import MockDate from 'mockdate'

MockDate.set(new Date('1/1/2016'))

const snap = (object) => {
    expect(object).toMatchSnapshot()
}

module.exports = {
    snap,
}
