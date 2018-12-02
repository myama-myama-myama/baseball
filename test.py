from time import sleep
from selenium import webdriver

def main():
    driver = webdriver.Chrome("C:/driver/chromedriver.exe")
    driver.get("file:///C:/Users/masah/project/baseball/index.html")
    driver.set_window_size(600,900)

    """
    for i in range(9):
        s1(driver)
    """
    
    s1_1t(driver)
    s1_1t(driver)    
    sleep(10)
    
def click_pitcher_menu(driver,val):
    sleep(0.5)
    driver.find_element_by_id("label1").click()
    sleep(0.5)
    print("input[type='radio'][value=\'"+val+"\']")
    str = "input[type='radio'][value=\'"+val+"\']"
    driver.find_element_by_css_selector(str).click()
    sleep(0.5)
    driver.find_element_by_id("btn1").click()


def s0_01(driver):
    click_pitcher_menu(driver,'FB')
    click_pitcher_menu(driver,'FB')
    click_pitcher_menu(driver,'FB')
    click_pitcher_menu(driver,'FB')
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')        

    # nakatsusyou
def s1_1t(driver):
    # 4B,K,K,
    # hit between C&R, 2out1,3runners
    # out 6_4 grounder
    click_pitcher_menu(driver,'FB')
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')


def s1_1b(driver):
    # K,K,K,
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')        

def s1_2t(driver):
    # fly 7
    # out 6_3
    # out 6_3    
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')        

def s1_2b(driver):
    # 4,hit,front_of_left
    # 5,hit,front_of_center
    # 6,out,K
    # 7,hit,grounder,front_of_left, 1out1,2,3runner
    #   1point, bork,1out2,3runner
    # 8,hit,front_of_center, 1point, 1out1,3runner
    # 9,out,squiz, 2out1,2runner
    # 1,out, fly 9
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')        

def s1_3t(driver):
    # out,6_3
    # 4B,1out1runner
    # out,K,2out1runner
    # steal,1out2runner
    # hit, naianda, 1point, 2out1runner
    # out,liner,
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')        

def s1_3b(driver):
    # 2,DB
    # 3,K
    # 4,out 6_4, 2out1,3runner
    # steal, 2out2,3runner
    # 5,fly center
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')        

def s1_4t(driver):
    # K,K,K,
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')        

def s1_4b(driver):
    # K,K,K,
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')        


def s1_5t(driver):
    # K,K,K,
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')        

def s1_5b(driver):
    # K,K,K,
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')        

def s1_6t(driver):
    # K,K,K,
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')        

def s1_6b(driver):
    # K,K,K,
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')        

def s1_7t(driver):
    # K,K,K,
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')        

def s1_7b(driver):
    # K,K,K,
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')        

def s1_8t(driver):
    # K,K,K,
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')        

def s1_8b(driver):
    # K,K,K,
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')        

def s1_9t(driver):
    # K,K,K,
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')        

def s1_9b(driver):
    # K,K,K,
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')
    click_pitcher_menu(driver,'K')        
    
    
main()



