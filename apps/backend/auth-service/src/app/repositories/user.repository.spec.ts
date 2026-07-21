import type { Model } from 'mongoose';
import { UserRepository } from './user.repository';
import type { UserDocument } from '../schemas/user.schema';

const buildQuery = <T>(result: T) => ({
  exec: jest.fn().mockResolvedValue(result),
});

describe('UserRepository', () => {
  const userModel = {
    findOne: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
    updateOne: jest.fn(),
  };

  let repository: UserRepository;

  beforeEach(() => {
    jest.clearAllMocks();

    repository = new UserRepository(userModel as unknown as Model<UserDocument>);
  });

  it('should find user by email', async () => {
    const user = { id: '6a426f90fcc2f5e584cb060a' } as UserDocument;
    const query = buildQuery(user);

    userModel.findOne.mockReturnValue(query);

    await expect(repository.findByEmail('max@max.com')).resolves.toBe(user);

    expect(userModel.findOne).toHaveBeenCalledWith({ email: 'max@max.com' });
    expect(query.exec).toHaveBeenCalled();
  });

  it('should create user', async () => {
    const payload = {
      name: 'Max',
      surname: 'Dobinda',
      email: 'max@max.com',
      password: 'hashed-password',
    };
    const user = { id: '6a426f90fcc2f5e584cb060a', ...payload } as UserDocument;

    userModel.create.mockResolvedValue(user);

    await expect(repository.create(payload)).resolves.toBe(user);

    expect(userModel.create).toHaveBeenCalledWith(payload);
  });

  it('should find user by id', async () => {
    const user = { id: '6a426f90fcc2f5e584cb060a' } as UserDocument;
    const query = buildQuery(user);

    userModel.findById.mockReturnValue(query);

    await expect(repository.findById('6a426f90fcc2f5e584cb060a')).resolves.toBe(
      user,
    );

    expect(userModel.findById).toHaveBeenCalledWith('6a426f90fcc2f5e584cb060a');
    expect(query.exec).toHaveBeenCalled();
  });

  it('should update refresh token hash', async () => {
    const query = buildQuery({ modifiedCount: 1 });

    userModel.updateOne.mockReturnValue(query);

    await expect(
      repository.updateRefreshTokenHash(
        '6a426f90fcc2f5e584cb060a',
        'refresh-token-hash',
      ),
    ).resolves.toEqual({ modifiedCount: 1 });

    expect(userModel.updateOne).toHaveBeenCalledWith(
      { _id: '6a426f90fcc2f5e584cb060a' },
      { refreshTokenHash: 'refresh-token-hash' },
    );
  });

  it('should clear refresh token hash', async () => {
    const query = buildQuery({ modifiedCount: 1 });

    userModel.updateOne.mockReturnValue(query);

    await expect(
      repository.clearRefreshTokenHash('6a426f90fcc2f5e584cb060a'),
    ).resolves.toEqual({ modifiedCount: 1 });

    expect(userModel.updateOne).toHaveBeenCalledWith(
      { _id: '6a426f90fcc2f5e584cb060a' },
      { $unset: { refreshTokenHash: '' } },
    );
  });
});
