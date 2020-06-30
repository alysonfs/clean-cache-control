import { CacheStore } from '@/data/protocols/cache'
import { LocalSavePurchases } from '@/data/usercases'
import { SavePurchases } from '@/domain'

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0
  insertCallsCount = 0
  deleteKey: string
  insertKey: string
  insertValues: Array<SavePurchases.Params> = []

  delete(key: string): void {
    this.deleteCallsCount++
    this.deleteKey = key
  }
  insert(key: string, value: any): void {
    this.insertCallsCount++
    this.insertKey = key
    this.insertValues = value
  }
  simulateDeleteError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'delete').mockImplementationOnce(() => { throw new Error })
  }

  simulateInsertError(): void {
    jest.spyOn(CacheStoreSpy.prototype, 'insert').mockImplementationOnce(() => { throw new Error })
  }
}

const mockPurchases = (): Array<SavePurchases.Params> => [{
  id: '1',
  date: new Date(),
  value: 50
},{
  id: '2',
  date: new Date(),
  value: 70
}
]

type SutTypes = {
  sut: LocalSavePurchases
  cacheStore: CacheStoreSpy
}
const makeSut = (): SutTypes => {
  const cacheStore = new CacheStoreSpy()
  const sut = new LocalSavePurchases(cacheStore)
  return {
    sut,
    cacheStore
  }
}

describe('LocalSavePurchases', () => {
  test('Sould not delete cache on sut.init', () => {
    const { cacheStore } = makeSut()
    expect(cacheStore.deleteCallsCount).toBe(0)
  })

  test('Sould delete old cache on sut.save', async () => {
    const { sut, cacheStore } = makeSut()
    const purchases = mockPurchases()
    await sut.save(purchases)
    expect(cacheStore.deleteCallsCount).toBe(1)
    expect(cacheStore.deleteKey).toBe('purchases')
  })

  test('Sould not insert new cash is dele fails', () => {
    const { sut, cacheStore } = makeSut()
    cacheStore.simulateDeleteError()
    const purchases = mockPurchases()
    const promise = sut.save(purchases) 
    expect(cacheStore.insertCallsCount).toBe(0)
    expect(promise).rejects.toThrow()
  });

  test('Sould insert new cash if delete success', async () => {
    const { sut, cacheStore } = makeSut()
    const purchases = mockPurchases()
    await sut.save(purchases )
    expect(cacheStore.deleteCallsCount).toBe(1)
    expect(cacheStore.insertCallsCount).toBe(1)
    expect(cacheStore.insertKey).toBe('purchases')
    expect(cacheStore.insertValues).toEqual(purchases)
  });

  test('Sould thorw if insert thorws', async () => {
    const { sut, cacheStore } = makeSut()
    cacheStore.simulateInsertError()
    const promise = sut.save(mockPurchases())
    expect(promise).rejects.toThrow()
  });

});