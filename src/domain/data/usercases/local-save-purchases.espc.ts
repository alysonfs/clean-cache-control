class LocalSavePurchases {
  constructor(private readonly cacheStore: CacheStore){}

  async save (): Promise<void>{

  }
}

interface CacheStore {
  
}

class CacheStoreSpy implements CacheStore{
  deleteCallsCount = 0
}

describe('Local save purchases', () => {
  test('Sould not delete cache on sut.init', () => {
    const cacheStore = new CacheStoreSpy()
    new LocalSavePurchases(cacheStore)    
    expect(cacheStore.deleteCallsCount).toBe(0)
  });

  test('Sould delete old cache on sut.save', async () => {
    const cacheStore = new CacheStoreSpy()
    const sut = new LocalSavePurchases(cacheStore)
    await sut.save()
    expect(cacheStore.deleteCallsCount).toBe(0)
  });
});