# Contributing to BrainFit

Thank you for your interest in contributing to BrainFit! This document provides guidelines and information for contributors.

## How to Contribute

### Types of Contributions
- **Bug Reports**: Report bugs or issues you encounter
- **Feature Requests**: Suggest new features or improvements
- **Documentation**: Help improve documentation
- **Code Contributions**: Submit code improvements or new features
- **Testing**: Help test the application and report issues

### **Before You Start**
1. Check existing [Issues](https://github.com/ajmcginty/brain-fit/issues) to see if your idea has already been discussed
2. Review the [Current Development Focus](#current-development-focus) section below
3. Ensure your contribution aligns with the project's goals and roadmap

## 🚀 **Development Setup**

### Prerequisites
- Node.js (v19 or higher)
- npm (v9 or higher) or yarn (v4 or higher)
- Expo CLI (`npm install -g expo-cli`)
- Git (v2.30 or higher)
- For iOS development:
  - macOS
  - Xcode (latest version)
  - iOS Simulator
- For Android development:
  - Android Studio
  - Android SDK
  - Android Emulator

### **Setup Steps**
1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/brain-fit.git`
3. Navigate to the app directory: `cd brain-fit/app`
4. Install dependencies: `npm install`
5. Start development server: `npm start`

## 📝 **Code Style Guidelines**

### **TypeScript**
- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type - use proper typing
- Follow existing naming conventions

### **React Native/Expo**
- Use functional components with hooks
- Follow React Native best practices
- Use Expo APIs when possible
- Maintain consistent component structure

### **File Organization**
- Place components in `src/components/`
- Place screens in `src/screens/`
- Place utilities in `src/utils/`
- Place types in `src/types/`

### **Naming Conventions**
- Components: PascalCase (e.g., `GoalCheckbox.tsx`)
- Files: PascalCase for components, camelCase for utilities
- Functions: camelCase
- Constants: UPPER_SNAKE_CASE

## 🔄 **Development Workflow**

### **1. Create a Feature Branch**
```bash
git checkout -b feature/your-feature-name
```

### **2. Make Your Changes**
- Write clean, readable code
- Add appropriate comments
- Follow existing patterns
- Test your changes thoroughly

### **3. Commit Your Changes**
```bash
git add .
git commit -m "feat: add new feature description"
```

**Commit Message Format:**
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

### **4. Push and Create Pull Request**
```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear description of changes
- Screenshots if UI changes
- Testing instructions
- Any relevant issue numbers

## 🧪 **Testing Guidelines**

### **Before Submitting**
- Test on both iOS and Android (if applicable)
- Test offline functionality
- Verify no console errors
- Check performance impact
- Test edge cases

### **Testing Checklist**
- [ ] App launches without errors
- [ ] Navigation works correctly
- [ ] State management functions properly
- [ ] Storage operations work
- [ ] UI renders correctly on different screen sizes
- [ ] No memory leaks or performance issues

## 📚 **Documentation**

### **Code Documentation**
- Add JSDoc comments for complex functions
- Document component props and usage
- Update README.md if adding new features
- Keep development plan updated

### Documentation Files
- `README.md` - Project overview and setup
- `CONTRIBUTING.md` - This file
- `docs/technical/` - Technical documentation
  - `architecture.md` - System architecture
  - `performance.md` - Performance guidelines
  - `security.md` - Security measures
- Code comments and JSDoc

## 🐛 **Bug Reports**

### **Bug Report Template**
```markdown
**Bug Description**
Clear description of the issue

**Steps to Reproduce**
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- Device: [e.g., iPhone 14, Samsung Galaxy S21]
- OS: [e.g., iOS 17.0, Android 13]
- App Version: [e.g., 1.0.0]

**Additional Information**
Screenshots, logs, or other relevant details
```

## 💡 **Feature Requests**

### **Feature Request Template**
```markdown
**Feature Description**
Clear description of the requested feature

**Use Case**
Why this feature would be useful

**Proposed Implementation**
Any ideas on how to implement it

**Alternatives Considered**
Other approaches you've thought about

**Additional Information**
Any other relevant details
```

## 🔍 **Code Review Process**

### **Review Checklist**
- [ ] Code follows style guidelines
- [ ] Functionality works as expected
- [ ] No performance issues introduced
- [ ] Proper error handling
- [ ] Tests pass (if applicable)
- [ ] Documentation updated

### **Review Comments**
- Be constructive and helpful
- Suggest specific improvements
- Ask questions if something is unclear
- Praise good work

## 📋 **Issue Labels**

We use the following labels to categorize issues:
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `priority: high` - High priority issues
- `priority: low` - Low priority issues

## Current Development Focus

### Current Status
- **MVP Completion**: 95% complete
- **Current Phase**: MMKV Integration & Performance
- **Target Completion**: 3 weeks to production-ready status

### Immediate Priorities
1. **MMKV Integration**
   - MMKV setup and configuration
   - Profile-aware storage structure
   - Data migration from AsyncStorage
   - Performance optimization

2. **Firebase Integration**
   - Firebase project setup
   - Profile-based security rules
   - Sync system implementation
   - Offline queue system

3. **Testing & Polish**
   - Comprehensive testing
   - Performance validation
   - Documentation updates
   - Final UI/UX refinements

### Performance Targets
- **App Launch**: < 2 seconds
- **Profile Operations**: < 1 second
- **Data Sync**: < 5 seconds
- **Storage Migration**: < 5 seconds per profile

## 📞 **Getting Help**

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Documentation**: Check the `BrainFit_Documentation/` folder

## 🙏 **Thank You**

Thank you for contributing to BrainFit! Your contributions help make cognitive health accessible to more people.

---

**Remember**: Every contribution, no matter how small, makes a difference! 🚀
