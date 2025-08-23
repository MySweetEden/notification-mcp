# **Notification MCP Server**

**🌐 Language / 言語**
- 🇺🇸 **English** (current page)
- 🇯🇵 **[日本語](README.md)**

---

## **1. Overview**

This project is a **Model Context Protocol (MCP) server** that integrates with AI applications such as **Claude Desktop**, **Cursor**, **VS Code**, and **Windsurf**. Its primary purpose is to provide user feedback through **sound and desktop notifications** when long-running processes or important tasks are completed. This enables users to monitor task progress in real-time and improve their work efficiency.

The server supports multiple distribution formats, allowing users to choose the optimal installation method for their environment:
- **DXT format**: One-click installation for Claude Desktop, Windsurf, etc.
- **NPM package**: Standard MCP server configuration for Cursor, VS Code, etc.
- **Source code**: Custom builds for developers

-----

## ⚠️ **Important: Environment-Specific Limitations**

### Claude Desktop (DXT Package)
- **🔊 Sound Notifications**: ✅ Fully functional
- **📱 Desktop Notifications**: ❌ Not available due to technical limitations
- **Recommended**: Use sound notifications (`playSound()`)

### Cursor・VSCode・Terminal Environments
- **🔊 Sound Notifications**: ✅ Fully functional  
- **📱 Desktop Notifications**: ✅ Fully functional

> **💡 Tip**: In Claude Desktop, use `playSound()` instead of `showNotification()` for reliable notifications.

-----

## **2. Features**

### **2.1 MCP Tools**
This server provides the following 5 MCP tools:

#### **Sound-related Tools**
  * **`playSound` tool**:
      * **Arguments**: None
      * **Operation**: Plays the configured sound file
      * **Volume**: Uses the current OS system volume setting
  
  * **`setSoundPath` tool**:
      * **Arguments**: `soundPath` (string) - Absolute path to sound file
      * **Operation**: Sets the sound file to use for notifications and saves to config
      * **Return**: Success/failure status and message
  
  * **`getSoundPath` tool**:
      * **Arguments**: None
      * **Operation**: Gets the currently configured sound file path
      * **Return**: Current sound file path
  
  * **`resetSoundPath` tool**:
      * **Arguments**: None
      * **Operation**: Resets sound settings to OS default sound
      * **Return**: Reset completion message

#### **Notification-related Tools**
  * **`showNotification` tool**:
      * **Arguments**: 
          * `title` (string) - Notification title
          * `message` (string) - Notification message
      * **Operation**: Displays OS-native desktop notification
      * **Return**: Notification display success/failure status

### **2.2 Usage**
You can use the notification features by instructing the AI as follows:

```
playSound()
```

```
showNotification("Task Complete", "Your AI processing has finished!")
```

```
setSoundPath("/path/to/your/custom/sound.wav")
```

-----

## **3. Installation & Setup**

### **Prerequisites**
- **Node.js**: 18.0.0 or higher
- **macOS**: Requires notification permissions and terminal-notifier installation
- **Windows/Linux**: Basic OS notification support

### **3.1 DXT Installation (Recommended for Claude Desktop/Windsurf)**

#### **Download & Install**
1. Download the latest `.dxt` file from [GitHub Releases](https://github.com/MySweetEden/notification-mcp/releases)
2. Open Claude Desktop
3. Go to Settings → Extensions
4. Click "Install DXT Package" and select the downloaded file
5. Restart Claude Desktop

#### **Verification**
```
showNotification("Setup Complete", "Notification MCP Server is ready!")
playSound()
```

### **3.2 Manual Setup for Cursor/VS Code**

#### **Prerequisites for macOS**
```bash
# Install terminal-notifier for reliable notifications
brew install terminal-notifier

# Install Node.js (if not already installed)
brew install node
```

#### **Project Setup**
```bash
# Clone and build the project
git clone https://github.com/MySweetEden/notification-mcp.git
cd notification-mcp
npm install
npm run build
```

#### **MCP Configuration**

##### **For Cursor**
```bash
# Automated setup (macOS/Linux)
npm run cursor:setup

# Windows
npm run cursor:setup:windows
```

**Or manual configuration in `~/.cursor/mcp.json`:**
```json
{
  "mcpServers": {
    "notification-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/notification-mcp/dist/index.js"]
    }
  }
}
```

##### **For VS Code**
Add to `settings.json`:
```json
{
  "mcp.servers": {
    "notification-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/notification-mcp/dist/index.js"]
    }
  }
}
```

#### **Verification**
```bash
# Basic functionality test
npm run test

# Notification test
npm run test:notification

# Sound test
npm run test:sound
```

-----

## **4. Configuration**

### **4.1 Sound Settings**
- **Default**: OS standard notification sound
- **Custom**: Any `.wav`, `.mp3`, `.aiff` format supported by your OS
- **Storage**: Configuration saved to `~/.notification-mcp-config.json`

### **4.2 Notification Settings**
- **macOS**: Requires notification permissions in System Preferences
- **Windows**: Uses Windows Toast notifications
- **Linux**: Uses desktop notification system

-----

## **5. Practical Examples**

### **5.1 Basic Notifications**
```javascript
// Simple notification
showNotification("Process Complete", "Your task has finished successfully!")

// With sound alert
playSound()
showNotification("Important Alert", "Urgent task completed!")
```

### **5.2 Custom Sound Configuration**
```javascript
// Set custom notification sound
setSoundPath("/Users/username/Documents/custom-alert.wav")

// Verify current setting
getSoundPath()

// Play test sound
playSound()

// Reset to default
resetSoundPath()
```

### **5.3 AI Assistant Integration Examples**

#### **Long-running Code Analysis**
```
AI Assistant, please analyze this large codebase. When you're done, send me a notification with showNotification("Analysis Complete", "Code review results are ready!") and play an alert sound with playSound().
```

#### **Data Processing Completion**
```
Process this dataset and notify me when complete. Use showNotification("Data Processing", "Your analysis is ready for review") followed by playSound().
```

#### **Custom Notifications for Different Tasks**
```
When the deployment finishes, use showNotification("🚀 Deployment", "Production deploy completed successfully!"). For errors, use showNotification("⚠️ Alert", "Deployment failed - check logs") and playSound().
```

-----

## **6. Best Practices**

### **6.1 Sound Selection**
- **Short duration**: 1-3 seconds recommended
- **Clear tone**: Easily distinguishable from other system sounds
- **Appropriate volume**: Consider your work environment
- **Format compatibility**: `.wav` files offer best compatibility across platforms

### **6.2 Notification Design**
- **Clear titles**: Use descriptive, scannable titles
- **Concise messages**: Keep under 100 characters when possible
- **Consistent formatting**: Use similar patterns for similar types of notifications
- **Appropriate urgency**: Reserve frequent notifications for truly important events

### **6.3 System Integration**
- **Permission setup**: Ensure OS-level notification permissions are granted
- **Testing**: Verify functionality after installation with `npm run test:notification`
- **Environment consideration**: Adjust notification frequency based on work setting

-----

## **7. Troubleshooting**

### **7.1 macOS Notification Issues**

#### **Problem**: Notifications not appearing
**Solution**:
1. Check notification permissions:
   ```bash
   npm run test:notification:permission
   ```
2. Open System Preferences → Notifications & Focus
3. Find "Terminal" in the left list and enable notifications
4. Set notification style to "Banners" or "Alerts"
5. Restart macOS (recommended)

#### **Problem**: terminal-notifier not found
**Solution**:
```bash
brew install terminal-notifier
```

#### **Diagnosis Tool**
```bash
npm run test:notification:diagnosis
```

### **7.2 Permission and Configuration Issues**

#### **MCP Server Connection Issues**
1. Verify file paths are absolute (not relative)
2. Ensure the server is built: `npm run build`
3. Check AI application console for error messages
4. Test manually: `npm run test:interactive`

#### **Sound Playback Issues**
1. Verify sound file format compatibility
2. Check OS system volume settings
3. Test with default sound: `resetSoundPath()` then `playSound()`
4. Ensure file permissions allow reading

### **7.3 DXT Package Issues**

#### **Installation Problems**
1. Ensure you're using the latest Claude Desktop version
2. Download the latest `.dxt` file from GitHub Releases
3. Try manually installing via Claude Desktop settings

#### **Validation Problems**
```bash
# Validate DXT package
npm run dxt:validate

# Rebuild package
npm run dxt:build
```

-----

## **8. Development**

### **8.1 Building from Source**
```bash
git clone https://github.com/MySweetEden/notification-mcp.git
cd notification-mcp
npm install
npm run build
```

### **8.2 Available Scripts**
- `npm run build` - Compile TypeScript
- `npm run dev` - Watch mode development
- `npm run test` - Quick functionality test
- `npm run test:full` - Comprehensive test suite
- `npm run test:notification` - Notification system test
- `npm run test:sound` - Sound system test
- `npm run dxt:build` - Build DXT package
- `npm run cursor:setup` - Automated Cursor setup

### **8.3 Project Structure**
```
notification-mcp/
├── src/
│   ├── index.ts          # Main MCP server
│   ├── notification.ts   # Notification management
│   ├── sound.ts         # Sound playback
│   ├── config.ts        # Configuration management
│   └── types.ts         # Type definitions
├── dist/                # Compiled JavaScript
├── docs/                # Documentation
└── scripts/             # Setup scripts
```

-----

## **9. Technical Specifications**

### **9.1 System Requirements**
- **Node.js**: 18.0.0 or higher
- **Memory**: 50MB typical usage
- **Disk Space**: 20MB for installation
- **Network**: None required (local operation)

### **9.2 Supported Platforms**
- **macOS**: 10.14+ (with terminal-notifier)
- **Windows**: 10+ (Toast notifications)
- **Linux**: Desktop notification system required

### **9.3 MCP Protocol Compliance**
- **Version**: MCP 1.0
- **Transport**: stdio
- **Capabilities**: tools
- **Security**: Local execution only

-----

## **10. License & Support**

### **10.1 License**
This project is licensed under the [MIT License](LICENSE).

### **10.2 Support**
- **GitHub Issues**: [Report bugs and feature requests](https://github.com/MySweetEden/notification-mcp/issues)
- **Discussions**: [Community support and questions](https://github.com/MySweetEden/notification-mcp/discussions)
- **Documentation**: This README and [development docs](docs/)

### **10.3 Contributing**
Contributions are welcome! Please read our [contributing guidelines](docs/development/README.md) before submitting pull requests.

-----

## **11. Future Enhancements**

### **11.1 Planned Features**
- **Custom notification themes**: Customizable visual styles
- **Multiple sound profiles**: Different sounds for different event types
- **Integration webhooks**: Remote notification triggers
- **Cross-platform sound library**: Enhanced audio format support
- **Visual notification customization**: Icons, colors, and duration settings

### **11.2 Roadmap**
- **v1.1**: Enhanced macOS integration and sound customization
- **v1.2**: Windows notification improvements
- **v1.3**: Advanced configuration options
- **v2.0**: Multi-application support and webhook integration

-----

*This MCP server enhances your AI assistant experience by providing reliable, cross-platform notification capabilities for improved workflow integration and task monitoring.*
