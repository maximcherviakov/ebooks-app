# ZAP Dynamic Application Security Testing (DAST)

This directory contains configuration files for ZAP (Zed Attack Proxy) Dynamic Application Security Testing (DAST) that runs as part of our CI/CD pipeline.

## Files

- **`rules.tsv`**: ZAP scanning rules configuration. Defines which security rules to apply and their severity levels.
- **`zap.conf`**: General ZAP configuration including scan parameters and limits.
- **`context.xml`**: ZAP context configuration defining what URLs to include/exclude from scanning.
- **`auth-script.js`**: Authentication script template for testing authenticated areas of the application.

## How it works

The DAST security scan runs in the CI/CD pipeline after the application containers are started:

1. **Application Startup**: The application is built and started using Docker Compose
2. **Health Check**: The pipeline waits for the application to be ready
3. **Baseline Scan**: ZAP performs a baseline security scan (passive + spider)
4. **Full Scan**: ZAP performs a comprehensive active security scan
5. **Report Generation**: Security reports are generated and uploaded as artifacts

## Security Rules

The scan checks for common web application vulnerabilities including:

- Cross-Site Scripting (XSS)
- SQL Injection
- Cross-Site Request Forgery (CSRF)
- Security Headers
- Authentication Issues
- Session Management
- Information Disclosure
- Input Validation

## Configuration

### Scan Timing
- Baseline scan timeout: 15 minutes
- Full scan timeout: 30 minutes
- Maximum rule execution: 5 minutes per rule

### Scope
- **Included**: All URLs under `http://localhost:80/`
- **Excluded**: Static assets (CSS, JS, images), logout endpoints

### Authentication

To enable authenticated scanning:

1. Update the `auth-script.js` with your application's authentication logic
2. Add authentication configuration to the CI/CD pipeline
3. Configure user credentials in GitHub Secrets

## Reports

ZAP generates multiple report formats:

- **HTML Report**: Human-readable security findings
- **JSON Report**: Machine-readable results for integration
- **XML Report**: Detailed technical findings

Reports are uploaded as GitHub Actions artifacts and retained for 30 days.

## Customization

### Adding New Rules

Edit `rules.tsv` to add new security rules:
```
RULE_ID    SEVERITY    COMMENT
40018      WARN        SQL Injection (Active)
```

### Excluding False Positives

Add rules to ignore false positives:
```
10009      IGNORE      In Page Banner Information Leak (Passive)
```

### Modifying Scan Scope

Update `context.xml` to change which URLs are scanned:
```xml
<incregexes>http://localhost:80/api/.*</incregexes>
<excregexes>
    <regex>http://localhost:80/static/.*</regex>
</excregexes>
```

## Best Practices

1. **Review Reports**: Always review security findings and address critical/high severity issues
2. **Update Rules**: Regularly update ZAP rules to catch new vulnerability types
3. **Authenticated Testing**: Configure authentication to test protected areas
4. **Performance**: Adjust timeouts based on application complexity
5. **Integration**: Consider integrating with security dashboards or SIEM systems

## Troubleshooting

### Common Issues

1. **Timeout Errors**: Increase scan timeouts in the CI/CD pipeline
2. **False Positives**: Add exclusions to `rules.tsv`
3. **Authentication Failures**: Check and update the authentication script
4. **Network Issues**: Verify application accessibility from ZAP container

### Debugging

Enable debug mode by adding `-d` to `cmd_options` in the CI/CD pipeline:
```yaml
cmd_options: '-a -j -m 10 -T 15 -d'
```

## Security Considerations

- ZAP scans can generate significant load on the application
- Scans may trigger security monitoring systems
- Some active scan tests may modify data (use test environments)
- Reports may contain sensitive information - handle accordingly
