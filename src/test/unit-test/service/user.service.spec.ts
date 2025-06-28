import { UserService } from '../../../app/service/user.service';
import { UserRepository } from '../../../app/repository/user/user.repository';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';

// Mocks
jest.mock('../../../app/repository/user/user.repository');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockBcrypt: jest.Mocked<typeof bcrypt>;
  let mockSign: jest.MockedFunction<typeof sign>;

  beforeEach(() => {
    jest.clearAllMocks();

    authService = new UserService();
    mockUserRepository = authService['userRepository'] as jest.Mocked<UserRepository>;
    mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
    mockSign = sign as jest.MockedFunction<typeof sign>;

    process.env.JWT_SECRET = 'test-secret';
  });

  afterEach(() => {
    delete process.env.JWT_SECRET;
  });

  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'Password123@',
    };

    const mockUser = {
      id: 'user-id',
      email: 'test@example.com',
      password: 'hashed-password',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    it('should successfully register a new user', async () => {
      // Arrange
      mockUserRepository.findUserByEmail.mockResolvedValue(null);
      mockBcrypt.hash.mockResolvedValue('hashed-password' as never);
      mockUserRepository.createUser.mockResolvedValue(mockUser);

      // Act
      const result = await authService.register(registerDto);

      // Assert
      expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockBcrypt.hash).toHaveBeenCalledWith('Password123@', 10);
      expect(mockUserRepository.createUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'hashed-password',
      });
      expect(result).toEqual({
        id: 'user-id',
        email: 'test@example.com',
      });
    });

    it('should throw error if email already exists', async () => {
      // Arrange
      mockUserRepository.findUserByEmail.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(authService.register(registerDto)).rejects.toThrow('Email already exists');

      expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockBcrypt.hash).not.toHaveBeenCalled();
      expect(mockUserRepository.createUser).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'Password123@',
    };

    const mockUser = {
      id: 'user-id',
      email: 'test@example.com',
      password: 'hashed-password',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    it('should successfully login with valid credentials', async () => {
      // Arrange
      mockUserRepository.findUserByEmail.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(true as never);
      mockSign.mockReturnValue('jwt-token' as never);

      // Act
      const result = await authService.login(loginDto);

      // Assert
      expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockBcrypt.compare).toHaveBeenCalledWith('Password123@', 'hashed-password');
      expect(mockSign).toHaveBeenCalledWith(
        {
          sub: 'user-id',
          email: 'test@example.com',
          iat: expect.any(Number),
        },
        'test-secret',
        { expiresIn: '7d' }
      );
      expect(result).toEqual({
        access_token: 'jwt-token',
      });
    });

    it('should return null for non-existent user', async () => {
      // Arrange
      mockUserRepository.findUserByEmail.mockResolvedValue(null);

      // Act
      const result = await authService.login(loginDto);

      // Assert
      expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockBcrypt.compare).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null for invalid password', async () => {
      // Arrange
      mockUserRepository.findUserByEmail.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(false as never);

      // Act
      const result = await authService.login(loginDto);

      // Assert
      expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockBcrypt.compare).toHaveBeenCalledWith('Password123@', 'hashed-password');
      expect(mockSign).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should throw error if JWT_SECRET is not set', async () => {
      // Arrange
      delete process.env.JWT_SECRET;
      mockUserRepository.findUserByEmail.mockResolvedValue(mockUser);
      mockBcrypt.compare.mockResolvedValue(true as never);

      // Act & Assert
      await expect(authService.login(loginDto)).rejects.toThrow(
        'JWT_SECRET não está definido no .env'
      );
    });
  });
});
