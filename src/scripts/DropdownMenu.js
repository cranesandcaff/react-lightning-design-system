import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import Icon from './Icon';


export class DropdownMenuItem extends Component {
  onKeyDown(e, ...args) {
    if (e.keyCode === 13 || e.keyCode === 32) { // return or space
      e.preventDefault();
      e.stopPropagation();
      if (this.props.onClick) {
        this.props.onClick(e, ...args);
      }
    } else if (e.keyCode === 40 || e.keyCode === 38) {
      e.preventDefault();
      e.stopPropagation();
      const currentEl = e.target.parentElement;
      let itemEl = e.keyCode === 40 ? currentEl.nextSibling : currentEl.previousSibling;
      while (itemEl) {
        const anchorEl = itemEl.querySelector('.react-slds-menuitem[tabIndex]');
        if (anchorEl && !anchorEl.disabled) {
          anchorEl.focus();
          return;
        }
        itemEl = e.keyCode === 40 ? itemEl.nextSibling : itemEl.previousSibling;
      }
    }
  }

  onBlur(e) {
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  }

  onFocus(e) {
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  }

  render() {
    const {
      className, label, icon, iconRight, selected, disabled, tabIndex = 0, onClick, children,
      ...props,
    } = this.props;
    const menuItemClass = classnames(
      'slds-dropdown__item',
      { 'slds-is-selected': selected },
      className
    );
    return (
      <li className={ menuItemClass } disabled={ disabled }>
        <a
          className='slds-truncate react-slds-menuitem'
          role='menuitem'
          aria-disabled={ disabled }
          tabIndex={ disabled ? null : tabIndex }
          onClick={ disabled ? null : onClick }
          onKeyDown={ disabled ? null : this.onKeyDown.bind(this) }
          onBlur={ disabled ? null : this.onBlur.bind(this) }
          onFocus={ disabled ? null : this.onFocus.bind(this) }
          { ...props }
        >
          <p className='slds-truncate'>
            { icon ? <Icon icon={ icon } size='x-small' align='left' /> : null }
            { label || children }
          </p>
          { iconRight ? <Icon icon={ iconRight } size='x-small' align='right' /> : null }
        </a>
      </li>
    );
  }
}

DropdownMenuItem.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  icon: PropTypes.string,
  iconRight: PropTypes.string,
  disabled: PropTypes.bool,
  tabIndex: PropTypes.number,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  children: PropTypes.node,
};


export const MenuItem = DropdownMenuItem;


export default class DropdownMenu extends Component {
  onMenuItemBlur(e) {
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  }

  onMenuItemFocus(e) {
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  }

  onKeyDown(e) {
    if (e.keyCode === 27) { // ESC
      if (this.props.onMenuClose) {
        this.props.onMenuClose();
      }
    }
  }

  renderMenuItem(menuItem) {
    const { onClick, onBlur, onFocus, ...props } = menuItem.props;
    const onMenuItemClick = (...args) => {
      if (onClick) { onClick(...args); }
      if (this.props.onMenuItemClick) {
        this.props.onMenuItemClick(props, ...args);
      }
    };
    const onMenuItemFocus = (e) => {
      if (onFocus) { onFocus(e); }
      this.onMenuItemFocus(e);
    };
    const onMenuItemBlur = (e) => {
      if (onBlur) { onBlur(e); }
      this.onMenuItemBlur(e);
    };
    return React.cloneElement(menuItem, {
      onClick: onMenuItemClick,
      onBlur: onMenuItemBlur,
      onFocus: onMenuItemFocus,
    });
  }

  render() {
    const {
      className, align = 'left', size, header, nubbinTop, hoverPopup, children,
    } = this.props;
    const dropdownMenuClassNames = classnames(
      className,
      'slds-dropdown',
      'slds-dropdown--menu',
      `slds-dropdown--${align}`,
      {
        [`slds-dropdown--${size}`]: size,
        'slds-dropdown--nubbin-top': nubbinTop,
        'react-slds-no-hover-popup': !hoverPopup,
      }
    );
    return (
      <div
        className={ dropdownMenuClassNames }
        onKeyDown={ this.onKeyDown.bind(this) }
      >
        {
          header ?
            <div className='slds-dropdown__header'>
              <span className='slds-text-heading--label'>{ header }</span>
            </div> :
            null
        }
        <ul className='slds-dropdown__list' role='menu'>
          { React.Children.map(children, this.renderMenuItem.bind(this)) }
        </ul>
      </div>
    );
  }

}


DropdownMenu.propTypes = {
  className: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center', 'right']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  header: PropTypes.string,
  nubbinTop: PropTypes.bool,
  hoverPopup: PropTypes.bool,
  onMenuItemClick: PropTypes.func,
  onMenuClose: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  children: PropTypes.node,
};
