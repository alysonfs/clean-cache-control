class LocalSavePurchases {
  constructor(private readonly cacheStore: CacheStore){}
}

interface CacheStore {
  
}

class CacheStoreSpy implements CacheStore{
  deleteCallsCount = 0
}

describe('Local save purchases', () => {
  test('Sould not delete cache on sut.init', () => {
    const cacheStore = new CacheStoreSpy()
    const sut = new LocalSavePurchases(cacheStore)    
    expect(cacheStore.deleteCallsCount).toBe(0)
  });
});