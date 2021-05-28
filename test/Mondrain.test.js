const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-as-promised'))

const MondrainERC721 = artifacts.require('./MondrainERC721.sol')
const MondrainERC20 = artifacts.require('./MondrainERC20.sol')
const MondrainLottery = artifacts.require('./MondrainLottery.sol')

const mintingFee = 50000000000000000;
const lotteryRunner = '0xB1e6dc2bCc85780E208a168d5E961542c4963a80';

function makeRandomString (length) {
  const result = []
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result.push(characters.charAt(Math.floor(Math.random() * charactersLength)))
  }
  return result.join('')
}

contract('MondrainERC721', (accounts) => {
  let contract

  before(async () => {
    contract = await MondrainERC721.deployed()
  })

  describe('deployment ERC721', async () => {
    it('deploys successfully', async () => {
      contract = await MondrainERC721.deployed()
      const address = contract.address
      chai.assert.notEqual(address, 0x0)
      chai.assert.notEqual(address, '')
      chai.assert.notEqual(address, null)
      chai.assert.notEqual(address, undefined)
    })
    it('has a name', async () => {
      const name = await contract.name()
      chai.assert.equal(name, 'mondrain.xyz')
    })
    it('has a symbol', async () => {
      const symbol = await contract.symbol()
      chai.assert.equal(symbol, 'QUADRO')
    })
  })

  describe('minting ERC721', async () => {
    it('lists tokens', async () => {
      // Mint 3 tokens
      let preMintBalance = await web3.eth.getBalance(accounts[0])
      console.log("Pre mint accounts[0] balance:", preMintBalance)
      console.log("Lottery Runner balance pre:", await web3.eth.getBalance(lotteryRunner))
      await contract.mint('ugo', '{}', {from: accounts[1], value: mintingFee} )
      await contract.mint('vien', '{}', {from: accounts[2], value: mintingFee})
      await contract.mint('dal bosco', '{}', {from: accounts[3], value: mintingFee})
      const totalSupply = await contract.totalSupply()
      console.log("Post mint accounts[0] balance:", await web3.eth.getBalance(accounts[0]) - preMintBalance)
      console.log("Lottery Runner balance post:", await web3.eth.getBalance(lotteryRunner))

      let token
      const result = []

      for (let i = 1; i <= totalSupply; i++) {
        token = await contract.tokens(i - 1)
        result.push(token)
      }

      const expected = ['ugo', 'vien', 'dal bosco']
      chai.assert.equal(result.join(','), expected.join(','))
    })

    it('Fail on large tokens greater than 4296', async () => {
      // Mint a large token beyond QRcode max
      const randomString = makeRandomString(4296)
      await expect(contract.mint(randomString, '{}',{from: accounts[0], value: mintingFee})).to.be.rejected
    })

    it('Fail on empty chars at beginning or at the end', async () => {
      // Mint a token that contains empty chars before or after
      const emptySpaceRandomString = ' ' + makeRandomString(10)
      await expect(contract.mint(emptySpaceRandomString, '{}',{from: accounts[0], value: mintingFee})).to.be.rejected
      const randomStringEmptySpace = makeRandomString(10) + ' '
      await expect(contract.mint(randomStringEmptySpace, '{}',{from: accounts[0], value: mintingFee})).to.be.rejected
    })
  })
})


contract('MondrainERC20', (accounts) => {
  let contract

  before(async () => {
    contract = await MondrainERC20.deployed()
  })

  describe('deployment ERC20', async () => {
    it('deploys successfully', async () => {
      contract = await MondrainERC20.deployed()
      const address = contract.address
      chai.assert.notEqual(address, 0x0)
      chai.assert.notEqual(address, '')
      chai.assert.notEqual(address, null)
      chai.assert.notEqual(address, undefined)
    })
    it('has a name', async () => {
      const name = await contract.name()
      chai.assert.equal(name, 'mondrain')
    })
    it('has a symbol', async () => {
      const symbol = await contract.symbol()
      chai.assert.equal(symbol, 'XMD')
    })
  })

  describe('minting ERC20', async () => {
    it('mint new tokens', async () => {
      contract = await MondrainERC20.deployed()
      await contract.mint(accounts[1], 1000)
      balance = await contract.balanceOf(accounts[1])
      chai.assert.equal(balance, 1000)
    })
  })
})

contract('MondrainLottery', (accounts) => {
  let lottery
  let erc721

  before(async () => {
    lottery = await MondrainLottery.deployed()
    erc721 = await MondrainERC721.deployed()

  })

  describe('deployment Lottery Game', async () => {
    it('deploys successfully', async () => {
      lottery = await MondrainLottery.deployed()
      const address = lottery.address
      chai.assert.notEqual(address, 0x0)
      chai.assert.notEqual(address, '')
      chai.assert.notEqual(address, null)
      chai.assert.notEqual(address, undefined)
    })
  })

  describe('Lottery draw', async () => {
    it('winner declared', async () => {
      lottery = await MondrainLottery.deployed()
      erc721 = await MondrainERC721.deployed()
      erc20 = await MondrainERC20.deployed()
      await erc20.grantMinterRole(lottery.address)
      await erc721.mint.sendTransaction(accounts[0], '{}',{from: accounts[0], value: mintingFee})
      await erc721.mint.sendTransaction(accounts[1], '{}',{from: accounts[1], value: mintingFee})
      await erc721.mint.sendTransaction(accounts[2], '{}',{from: accounts[2], value: mintingFee})
      await erc721.mint.sendTransaction(accounts[3], '{}',{from: accounts[3], value: mintingFee})
      await erc721.mint.sendTransaction(accounts[4], '{}',{from: accounts[4], value: mintingFee})
      await erc721.mint.sendTransaction(accounts[5], '{}',{from: accounts[5], value: mintingFee})
      await erc721.mint.sendTransaction(accounts[6], '{}',{from: accounts[6], value: mintingFee})
      await lottery.grantLotteryAdminRole(accounts[1])
      await lottery.rewardWinner({from: accounts[1]})
      winner = await lottery.getPastEvents('WinnerRewarded')
      console.log("Winner: ", winner[0].args['0'])
      winnerErc20Balance = await erc20.balanceOf(winner[0].args['0'])
      chai.assert.equal(winnerErc20Balance.toString(), '1000')
      console.log("Winner Balance: ", winnerErc20Balance.toString())
    })
  })
})


