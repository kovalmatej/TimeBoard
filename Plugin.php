<?php

namespace Kanboard\Plugin\Time_Board;

use Kanboard\Core\Plugin\Base;
use Kanboard\Core\Translator;

class Plugin extends Base
{
    public function initialize()
    {
    }

    public function onStartup()
    {
        Translator::load($this->languageModel->getCurrentLanguage(), __DIR__.'/Locale');
    }

    public function getPluginName()
    {
        return 'TimeBoard';
    }

    public function getPluginDescription()
    {
        return t('Display summary of time spend by each team member and allows to export data.');
    }

    public function getPluginAuthor()
    {
        return 'Matej Kovaľ';
    }

    public function getPluginVersion()
    {
        return '1.0.0';
    }

    public function getPluginHomepage()
    {
        return 'https://github.com/kovalmatej/TimeBoard';
    }
}

