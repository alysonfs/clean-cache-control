
import { LocalLoadPurchases } from '@/data/usercases'
import { mockPurchases, CacheStoreSpy } from '@/data/tests'

type SutTypes = {
  sut: LocalLoadPurchases
  cacheStore: CacheStoreSpy
}
const makeSut = (timestamp= new Date()): SutTypes => {
  const cacheStore = new CacheStoreSpy()
  const sut = new LocalLoadPurchases(cacheStore, timestamp)
  return {
    sut,
    cacheStore
  }
}

describe('LocalLoadPurchases', () => {
  test('Sould not delete or insert cache on sut.init', () => {
    const { cacheStore } = makeSut()
    expect(cacheStore.actions).toEqual([])
  })

  test('Sould not insert new cash is delete fails', async () => {
    const { sut, cacheStore } = makeSut()
    cacheStore.simulateDeleteError()
    const purchases = mockPurchases()
    const promise = sut.save(purchases)
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.delete])
    await expect(promise).rejects.toThrow()
  });

  test('Sould insert new cash if delete success', async () => {
    const timestamp = new Date()
    const { sut, cacheStore } = makeSut(timestamp)
    const purchases = mockPurchases()
    const promise = sut.save(purchases)
    expect(cacheStore.actions).toEqual([CacheStoreSpy.Action.delete, CacheStoreSpy.Action.insert])
    expect(cacheStore.deleteKey).toBe('purchases')
    expect(cacheStore.insertKey).toBe('purchases')
    expect(cacheStore.insertValues).toEqual({
      timestamp,
      value: purchases
    })
    await expect(promise).resolves.toBeFalsy()
  });

  test('Sould thorw if insert thorws', async () => { 
    const { sut, cacheStore } = makeSut()
    cacheStore.simulateInsertError()
    const promise = sut.save(mockPurchases())
    expect(cacheStore.actions).toEqual([
      CacheStoreSpy.Action.delete,
      CacheStoreSpy.Action.insert
    ])
    await expect(promise).rejects.toThrow()
  });
});