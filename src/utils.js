const ora = require('ora');
const likeLinux =  process.env.TERM === 'cygwin' || process.platform !== 'win32';

function Spinner(color) {
    let opt = likeLinux ? {
      spinner: {
        "interval": 125,
        "frames": [
          "∙∙∙",
          "●∙∙",
          "∙●∙",
          "∙∙●",
          "∙∙∙"
        ]
      }
    } : '';
    const spinner = ora(opt).start();
    spinner.color = color;
    return spinner;
}

function sleep(time) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, time);
    })
}

exports.Spinner = Spinner
exports.sleep = sleep