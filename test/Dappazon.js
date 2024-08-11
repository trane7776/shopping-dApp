const { expect } = require("chai")
const { ethers } = require('hardhat')
// 1 ether = 10^18 wei
// 1.000000000000000000 ==
// == 1000000000000000000




const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ID = 1;
const NAME = "Shoes";
const CATEGORY = 'Clothing';
const IMG = 'https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg';
const COST = tokens(1);
const RATING = 4;
const STOCK = 5;

describe("Dappazon", () => {
  let dappazon;
  let deployer, buyer;
  beforeEach(async() => {
    // Setup Accounts
    [deployer, buyer] = await ethers.getSigners()

    // Deploy contract
    const Dappazon = await ethers.getContractFactory('Dappazon');
    dappazon = await Dappazon.deploy();
  })

  describe('Deployment', () => {

    it('Sets the owner', async() => {
      expect(await dappazon.owner()).to.be.equal(deployer.address);
    })
    
  })

  describe('Listing', () => {
    let transaction;
    
    beforeEach(async () => {
      transaction = await dappazon.connect(deployer).list(
        ID,
        NAME,
        CATEGORY,
        IMG,
        COST,
        RATING,
        STOCK
      )
      await transaction.wait();
    })
    it('Returns item attributes', async() => {
      const item = await dappazon.items(ID);
      expect(item.id).to.equal(ID);
      expect(item.name).to.equal(NAME);
      expect(item.category).to.equal(CATEGORY);
      expect(item.image).to.equal(IMG);
      expect(item.cost).to.equal(COST);
      expect(item.rating).to.equal(RATING);
      expect(item.stock).to.equal(STOCK);
    })
    
    it('Emits List event', () => {
      expect(transaction).to.emit(dappazon, "List");
    })
    
  })

  describe('Buying', () => {
    let transaction;
    beforeEach(async () => {
      // List an item
      transaction = await dappazon.connect(deployer).list(
        ID,
        NAME,
        CATEGORY,
        IMG,
        COST,
        RATING,
        STOCK
      )
      await transaction.wait();

      // Buy an item
      transaction = await dappazon.connect(buyer).buy(ID, {value: COST});
      await transaction.wait();
    })

    it('Updates the contract balance', async () => {
      const result = await ethers.provider.getBalance(dappazon.address);
      console.log(result, COST);
      expect(result).to.equal(COST);
    })
    it("Updates buyer's order count", async() => {
      const result = await dappazon.orderCount(buyer.address);
      expect(result).to.equal(1);
    })

    it('Adds the order', async() => {
      const order = await dappazon.orders(buyer.address, 1);
      expect(order.time).to.greaterThan(0);
      expect(order.item.name).to.equal(NAME);
    })

    it('Emits Buy event', () => {
      expect(transaction).to.emit(dappazon, "Buy")
    })
  })
  describe("Withdraw", () => {
    let balanceBefore;
    beforeEach(async () => {
      // List an item
      let transaction = await dappazon.connect(deployer).list(
        ID,
        NAME,
        CATEGORY,
        IMG,
        COST,
        RATING,
        STOCK
      )
      await transaction.wait();

      // Buy an item
      transaction = await dappazon.connect(buyer).buy(ID, {value: COST});
      await transaction.wait();

      // Get Deployer balance before
      balanceBefore = await ethers.provider.getBalance(deployer.address);

      // Withdraw
      transaction = await dappazon.connect(deployer).withdraw();
      await transaction.wait();
    })
    it('Updates the owner balance', async() => {
      const balanceAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    })

    it('Updates the contract balance', async() => {
      const result = await ethers.provider.getBalance(dappazon.address);
      expect(result).to.be.equal(0);
    })
  })
  
})
