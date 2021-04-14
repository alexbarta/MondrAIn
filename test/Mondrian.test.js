const { assert } = require('chai')

const Mondrian = artifacts.require('./Mondrian.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

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
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })
        it('has a name', async() => {
            const name = await contract.name()
            assert.equal(name, 'Stijl')
        })
        it('has a symbol', async() => {
            const symbol = await contract.symbol()
            assert.equal(symbol, 'STIJL')
        })
    })

    describe('minting', async() => {
        it('lists tokens', async () => {
            // Mint 3 more tokens
            await contract.mint('ugo')
            await contract.mint('vien')
            await contract.mint('dal bosco')
            const totalSupply = await contract.totalSupply()
      
            let token
            let result = []
      
            for (var i = 1; i <= totalSupply; i++) {
              token = await contract.tokens(i - 1)
              result.push(token)
            }
      
            let expected = ['ugo', 'vien', 'dal bosco']
            assert.equal(result.join(','), expected.join(','))
          })
  
        })
})