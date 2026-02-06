const {
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
  listFragments,
  deleteFragment,
} = require('../../src/model/data/memory/index');

describe('In-memory database operations', () => {
  // writeFragment and readFragment -> METADATA
  test('writeFragment() and readFragment()', async () => {
    const fragmentObject = {
      ownerId: 'ownerId123',
      id: 'id123',
    };
    await writeFragment(fragmentObject);
    const res = await readFragment('ownerId123', 'id123');
    expect(res).toEqual(fragmentObject);
  });

  // writeFragmentData and readFragmentData -> ACTUAL CONTENT
  test('writeFragmentData() and readFragmentData()', async () => {
    const buffer = Buffer.from('my buffer');
    await writeFragmentData('ownerId123', 'id123', buffer);
    const res = await readFragmentData('ownerId123', 'id123');

    expect(res).toEqual(buffer);
  });

  // listFragments
  test('listFragments()', async () => {
    await writeFragment({
      ownerId: 'user1',
      id: 'id1',
    });
    await writeFragment({
      ownerId: 'user1',
      id: 'id2',
    });

    const res = await listFragments('user1');
    expect(res).toContain('id1');
    expect(res).toContain('id2');
  });

  // deleteFragments
  test('deleteFragments()', async () => {
    const buffer = Buffer.from('my buffer');
    await writeFragment({
      ownerId: 'user1',
      id: 'id1',
    });

    await writeFragmentData('user1', 'id1', buffer);
    await deleteFragment('user1', 'id1');
    const metadata = await readFragment('user1', 'id1');
    const data = await readFragmentData('user1', 'id1');
    expect(metadata).toBeUndefined();
    expect(data).toBeUndefined();
  });
});
