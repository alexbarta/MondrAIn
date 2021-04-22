const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))

const Mondrian = artifacts.require('./Mondrian.sol')

function makeRandomString(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result.push(characters.charAt(Math.floor(Math.random() * 
 charactersLength)));
   }
   return result.join('');
}

contract('Mondrian', (accounts) => {
    let contract

    before(async() => {
        contract = await Mondrian.deployed()
    })

    describe('deployment', async() => {
        it('deploys successfully',  async () => {
            contract = await Mondrian.deployed()
            const address = contract.address
            console.log(address)
            chai.assert.notEqual(address, 0x0)
            chai.assert.notEqual(address, '')
            chai.assert.notEqual(address, null)
            chai.assert.notEqual(address, undefined)
        })
        it('has a name', async() => {
            const name = await contract.name()
            chai.assert.equal(name, 'Stijl')
        })
        it('has a symbol', async() => {
            const symbol = await contract.symbol()
            chai.assert.equal(symbol, 'STIJL')
        })
    })

    describe('minting', async() => {
        it('lists tokens', async () => {
            // Mint 3 tokens
            await contract.mint('ugo', "{}")
            await contract.mint('vien', "{}")
            await contract.mint('dal bosco', "{}")
            const totalSupply = await contract.totalSupply()
      
            let token
            let result = []
      
            for (var i = 1; i <= totalSupply; i++) {
              token = await contract.tokens(i - 1)
              result.push(token)
            }
      
            let expected = ['ugo', 'vien', 'dal bosco']
            chai.assert.equal(result.join(','), expected.join(','))
          })

        it('Fail on large tokens greater than 4296', async () => {
            // Mint a large token beyond QRcode max 
            let randomString = makeRandomString(4296);
            await expect(contract.mint(randomString, "{}")).to.be.rejected;
        })

        it('Fail on empty chars at beginning or at the end', async () => {
            // Mint a token that contains empty chars before or after
            let emptySpacerandomString = " " + makeRandomString(10);
            await expect(contract.mint(emptySpacerandomString, "{}")).to.be.rejected;
            let randomStringEmptySpace = makeRandomString(10) + " ";
            await expect(contract.mint(randomStringEmptySpace, "{}")).to.be.rejected;
        })
    })
})