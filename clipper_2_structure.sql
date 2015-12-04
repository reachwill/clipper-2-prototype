-- phpMyAdmin SQL Dump
-- version 4.0.10.7
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Dec 04, 2015 at 09:20 AM
-- Server version: 5.5.44-37.3-log
-- PHP Version: 5.4.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `reachwil_clipper_phase2`
--

-- --------------------------------------------------------

--
-- Table structure for table `annotations`
--

CREATE TABLE IF NOT EXISTS `annotations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `clipper_anno_id` varchar(100) NOT NULL,
  `authors` varchar(200) NOT NULL,
  `parent_project` varchar(100) NOT NULL,
  `parent_clip` varchar(100) NOT NULL,
  `date_created` varchar(100) NOT NULL,
  `last_modified` varchar(100) NOT NULL,
  `start` varchar(30) NOT NULL,
  `end` varchar(30) NOT NULL,
  `text` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=406 ;

-- --------------------------------------------------------

--
-- Table structure for table `cliplists`
--

CREATE TABLE IF NOT EXISTS `cliplists` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `clipper_cliplist_id` varchar(100) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` varchar(3000) NOT NULL,
  `authors` varchar(100) NOT NULL,
  `owner` varchar(100) NOT NULL,
  `parent_project_id` varchar(100) NOT NULL,
  `clips` varchar(2000) NOT NULL,
  `date_created` varchar(100) NOT NULL,
  `last_modified` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=273 ;

-- --------------------------------------------------------

--
-- Table structure for table `clips`
--

CREATE TABLE IF NOT EXISTS `clips` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `orderIndex` int(11) NOT NULL,
  `clipper_clip_id` varchar(100) NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` longtext NOT NULL,
  `authors` varchar(100) NOT NULL,
  `owner` varchar(100) NOT NULL,
  `parent_project_id` varchar(100) NOT NULL,
  `parent_cliplist_id` varchar(100) NOT NULL,
  `date_created` varchar(100) NOT NULL,
  `last_modified` varchar(100) NOT NULL,
  `resource_uri` varchar(512) NOT NULL,
  `type` varchar(20) NOT NULL,
  `start` varchar(20) NOT NULL,
  `end` varchar(20) NOT NULL,
  `thumbnail` varchar(512) NOT NULL,
  `annotations` varchar(2000) NOT NULL,
  `tags` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=511 ;

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE IF NOT EXISTS `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `clipper_project_id` varchar(32) NOT NULL,
  `title` longtext NOT NULL,
  `description` longtext NOT NULL,
  `resource_count` int(11) NOT NULL,
  `cliplist_count` int(11) NOT NULL,
  `clip_count` int(11) NOT NULL,
  `authors` varchar(100) NOT NULL,
  `owner` varchar(100) NOT NULL,
  `date_created` varchar(100) NOT NULL,
  `last_modified` varchar(100) NOT NULL,
  `is_archived` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=293 ;

-- --------------------------------------------------------

--
-- Table structure for table `resources`
--

CREATE TABLE IF NOT EXISTS `resources` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `videoid` varchar(512) NOT NULL,
  `parent_project_id` varchar(100) NOT NULL,
  `sourcetype` varchar(16) NOT NULL,
  `added_by` varchar(256) NOT NULL,
  `description` varchar(2000) NOT NULL,
  `thumbnail` varchar(500) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=577 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
