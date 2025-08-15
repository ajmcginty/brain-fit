export class StorageError extends Error {
  constructor(
    message: string,
    public readonly operation: 'read' | 'write' | 'delete',
    public readonly key?: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'StorageError';
  }

  public static getReadableMessage(error: StorageError): string {
    switch (error.operation) {
      case 'read':
        return 'Unable to load your data. Please try again.';
      case 'write':
        return 'Unable to save your changes. Please try again.';
      case 'delete':
        return 'Unable to delete the data. Please try again.';
      default:
        return 'An error occurred while managing your data. Please try again.';
    }
  }
}
